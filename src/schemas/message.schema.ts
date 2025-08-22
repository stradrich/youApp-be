// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// @Schema({ timestamps: true })
// export class Message extends Document { 
//     @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//     senderId!: Types.ObjectId;

//     @Prop({ type: Types.ObjectId, ref: 'User', required: true})
//     receiverId!: Types.ObjectId;

//     @Prop({ required: true })
//     content!: string;
// }

// export const MessageSchema = SchemaFactory.createForClass(Message);

// src/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  from: Types.ObjectId | undefined;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  to: Types.ObjectId | undefined;

  @Prop({ type: String, required: true })
  text: string | undefined;

  @Prop({ type: String, required: true, index: true })
  conversationKey: string | undefined;

  @Prop({ type: Date, default: null })
  readAt: Date | null | undefined;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// helper to make a conversation key
export function makeConversationKey(user1: string, user2: string): string {
  return [user1, user2].sort().join(':');
}


