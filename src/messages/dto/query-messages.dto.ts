import { IsMongoId, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryMessagesDto {
  @IsMongoId()
  userA: string | undefined;

  @IsMongoId()
  userB: string | undefined;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 30;

  // Cursor: return messages with _id < before (Mongo ObjectId pagination)
  @IsOptional()
  @IsString()
  before?: string;
}
