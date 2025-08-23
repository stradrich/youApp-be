import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoConfigService } from './configs/mongo.config';
import { HealthModule } from './health/health.module';
import { UserModule } from './users/user.module';
import { ProfileModule } from './profile/profile.module';
import { RabbitmqModule } from './rabbitmg/rabbitmq.module';
import { MessagesModule } from './messages/messages.module';
import { DatabaseModule } from './configs/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [MongoConfigService],
      useFactory: async (mongoConfigService: MongoConfigService) =>
        mongoConfigService.createMongooseOptions(),
    }),
    HealthModule,
    UserModule,
    ProfileModule,
    RabbitmqModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

