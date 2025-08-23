import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

export class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    const isDocker = process.env.DOCKER_ENV === 'true';

    const uri = isDocker
      ? process.env.MONGODB_URI_DOCKER
      : process.env.MONGODB_URI;

    return {
      uri,
      dbName: process.env.MONGO_DB || 'youapp',
    };
  }
}
