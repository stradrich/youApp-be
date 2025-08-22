import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  fromUserId!: string;

  @IsMongoId()
  @IsNotEmpty()
  toUserId!: string;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;  // optional, for images/files later
}
