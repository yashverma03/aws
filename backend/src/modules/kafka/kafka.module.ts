import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';
import { LogModule } from '../log/log.module';

@Module({
  imports: [LogModule],
  providers: [KafkaService],
  controllers: [KafkaController]
})
export class KafkaModule {}
