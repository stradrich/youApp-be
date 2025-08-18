import { ConfigService } from '@nestjs/config';

export const mongoConfig = async (configService: ConfigService) => {
  const isDocker = configService.get<string>('DOCKER_ENV') === 'true';

  const uri = isDocker
    ? configService.get<string>('MONGODB_URI_DOCKER')
    : configService.get<string>('MONGODB_URI');

  return { uri };
};
