import { ConfigModule, ConfigService } from '@nestjs/config';

export const mongoConfig = async (configService: ConfigService) => ({
  uri: configService.get<string>('MONGODB_URI'),
});