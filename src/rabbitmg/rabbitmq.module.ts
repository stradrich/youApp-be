import { Global, Module } from '@nestjs/common';
import { RabbitmgService } from './rabbitmg.service';

@Global()
@Module({
  providers: [RabbitmgService],
  exports: [RabbitmgService],
})
export class RabbitmqModule {}
