import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  @Get()
  check() {
    const states = ['disconnected','connected','connecting','disconnecting'];
    return {
      status: 'ok',
      db: states[this.conn.readyState] ?? this.conn.readyState,
    };
  }
}
