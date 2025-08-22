import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Message, MessageDocument, makeConversationKey } from '../schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { RabbitmgService } from '../rabbitmg/rabbitmg.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly rabbit: RabbitmgService,
  ) {}

  async sendMessage(dto: CreateMessageDto) {
    const from = new Types.ObjectId(dto.fromUserId);
    const to = new Types.ObjectId(dto.toUserId);
    const conversationKey = makeConversationKey(from.toString(), to.toString());

    const doc = await this.messageModel.create({
      from,
      to,
      text: dto.text,
      conversationKey,
    });

    // push notifications to both participants
    await Promise.allSettled([
      this.rabbit.publishToUser(dto.toUserId, {
        type: 'chat.new',
        fromUserId: dto.fromUserId,
        toUserId: dto.toUserId,
        messageId: (doc._id as Types.ObjectId).toString(),
        text: dto.text,
        createdAt: doc.createdAt,
      }),
      this.rabbit.publishToUser(dto.fromUserId, {
        type: 'chat.sent',
        fromUserId: dto.fromUserId,
        toUserId: dto.toUserId,
        messageId: (doc._id as Types.ObjectId).toString(),
        text: dto.text,
        createdAt: doc.createdAt,
      }),
    ]);

    return doc;
  }

  async viewMessages(q: QueryMessagesDto) {
    const A = new Types.ObjectId(q.userA);
    const B = new Types.ObjectId(q.userB);
    const conversationKey = makeConversationKey(A.toString(), B.toString());

    const filter: FilterQuery<MessageDocument> = { conversationKey };
    if (q.before) {
      filter._id = { $lt: new Types.ObjectId(q.before) };
    }

    const items = await this.messageModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(q.limit ?? 30)
      .lean();

    return items.reverse(); // oldest → newest
  }

  async markRead(messageId: string, readerId: string) {
    const msg = await this.messageModel.findById(messageId);
    if (!msg) throw new NotFoundException('Message not found');

    // Only recipient can mark as read
    if (msg.to?.toString() !== readerId) return msg;

    if (!msg.readAt) {
      msg.readAt = new Date();
      await msg.save();

      await this.rabbit.publishToUser(msg.from!.toString(), {
        type: 'chat.read',
        messageId: (msg._id as Types.ObjectId).toString(),
        byUserId: readerId,
        readAt: msg.readAt,
      });
    }

    return msg;
  }
}
