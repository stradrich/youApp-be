// get-messages.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
  userId: string | undefined;
}
