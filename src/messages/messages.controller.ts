import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { MarkReadDto } from './dto/mark-read.dto';

/**
 * Endpoints shaped per your spec:
 * - POST   /api/sendMessage
 * - GET    /api/viewMessages?userA=&userB=&limit=&before=
 * - PATCH  /api/messages/:id/read
 */
@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Post('api/sendMessage')
  send(@Body() dto: CreateMessageDto) {
    return this.service.sendMessage(dto);
  }

  @Get('api/viewMessages')
  view(@Query() q: QueryMessagesDto) {
    return this.service.viewMessages(q);
  }

  // @Post('mark-read/:id')
  // async markRead(@Param('id') id: string, @Body() body: MarkReadDto) {
  //   if (!body.readerId) {
  //     throw new BadRequestException('readerId is required');
  //   }
  //   return this.service.markRead(id, body.readerId);
  // }
  @Patch('messages/:id/read')
  async markRead(@Param('id') id: string, @Body() body: MarkReadDto) {
    if (!body.readerId) {
      throw new BadRequestException('readerId is required');
    }
    return this.service.markRead(id, body.readerId);
  }
}
