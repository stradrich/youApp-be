import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, Options, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitmgService implements OnModuleInit, OnModuleDestroy {
  async publishToUser(userId: string, payload: any): Promise<void> {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    const queue = `user_${userId}`;
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
    this.logger.log(`[Rabbit] Published to user ${userId}`);
  }

  private readonly logger = new Logger(RabbitmgService.name);
  private connection?: amqp.AmqpConnectionManager | undefined;
  private channel?: ChannelWrapper | undefined;

  async onModuleInit() {
    this.logger.log('🐇 Connecting to RabbitMQ...');
    this.connection = amqp.connect(['amqp://localhost']);
    this.channel = this.connection.createChannel({
      json: true,
      setup: async (ch: ConfirmChannel) => {
        await ch.assertQueue('messages', { durable: true });
      },
    });

    this.connection.on('connect', () =>
      this.logger.log('✅ Connected to RabbitMQ'),
    );
    this.connection.on('disconnect', (e: { err?: Error }) =>
      this.logger.error(`❌ RabbitMQ disconnected: ${e?.err?.message || e}`),
    );
  }

  async onModuleDestroy() {
    if (this.connection) {
        await this.connection.close();
        this.logger.log('🔌 RabbitMQ connection closed');
    }
  }

  async sendMessage(queue: string, message: any) {
    if (!this.channel) {
        throw new Error('❌ RabbitMQ channel not initialized');
    }
    await this.channel.sendToQueue(queue, message, {
        persistent: true,
    } as Options.Publish);
    this.logger.log(`📤 Sent message to queue "${queue}"`);
  }

async consume(queue: string, handler: (msg: ConsumeMessage | null) => void) {
  if (!this.channel) {
    throw new Error('❌ RabbitMQ channel not initialized');
  }
  await this.channel.addSetup(async (ch: ConfirmChannel) => {
    await ch.assertQueue(queue, { durable: true });
    await ch.consume(queue, handler, { noAck: true });
  });
}

}
