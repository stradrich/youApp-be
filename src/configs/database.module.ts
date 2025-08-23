import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoConfigService } from './mongo.config';

@Module({
  imports: [ConfigModule],
  providers: [MongoConfigService],
  exports: [MongoConfigService], // 👈 important
})
export class DatabaseModule {}
