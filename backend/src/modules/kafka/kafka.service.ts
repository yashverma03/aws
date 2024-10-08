import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { generalResponse } from '../../utils/response.util';
import { KafkaSendMessageDto } from './dto/kafka-send-message.dto';
import { KafkaTopicEnum } from '../../enums/kafka-topic.enum';
import { LogService } from '../log/log.service';
import { LogTypeEnum } from '../../enums/log-type.enum';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isEnabled: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService
  ) {
    this.kafka = new Kafka({
      clientId: this.configService.getOrThrow<string>('KAFKA_CLIENT_ID'),
      brokers: [this.configService.getOrThrow<string>('KAFKA_BROKER')]
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.configService.getOrThrow<string>('KAFKA_GROUP_ID')
    });
    this.isEnabled = this.configService.getOrThrow<string>('KAFKA_ENABLED');
  }

  async onModuleInit() {
    if (this.isEnabled !== 'true') {
      Logger.log('Kafka is disabled, skipping initialization');
      return;
    }

    await Promise.all([this.producer.connect(), this.consumer.connect()]);

    // Subscribe to topics
    await Promise.all([
      this.consumer.subscribe({ topic: KafkaTopicEnum.General, fromBeginning: true }),
      this.consumer.subscribe({ topic: KafkaTopicEnum.Specific, fromBeginning: true })
    ]);

    // Run the consumer
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message?.value?.toString();
        const data = `Received message: topic = ${topic}, value = ${JSON.stringify(value)}`;
        Logger.log(data);

        switch (topic) {
          case KafkaTopicEnum.General:
            await this.logService.createLog({ message: data, type: LogTypeEnum.Kafka });
            break;
          case KafkaTopicEnum.Specific:
            await this.logService.createLog({ message: data, type: LogTypeEnum.Kafka });
            break;
          default:
            throw new InternalServerErrorException(`Unknown topic: ${topic}`);
        }
      }
    });
  }

  async onModuleDestroy() {
    if (this.isEnabled !== 'true') {
      return;
    }
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  /**
   * Send a message to a Kafka topic.
   */
  async sendMessage(dto: KafkaSendMessageDto) {
    const { topic, message } = dto;
    await this.producer.send({
      topic,
      messages: [{ value: message }]
    });
    return generalResponse('created', dto);
  }
}
