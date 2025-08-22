import { IsMongoId } from 'class-validator';

export class MarkReadDto {
  @IsMongoId()
  readerId: string | undefined;
}
