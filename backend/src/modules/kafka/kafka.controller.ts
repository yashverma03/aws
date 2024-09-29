import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ApiTags } from '@nestjs/swagger';
import { KafkaSendMessageDto } from './dto/kafka-send-message.dto';

@ApiTags('Kafka')
@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  /**
   * Send a message to a Kafka topic.
   */
  @Post()
  async sendMessage(@Body() body: KafkaSendMessageDto) {
    return await this.kafkaService.sendMessage(body);
  }
}
