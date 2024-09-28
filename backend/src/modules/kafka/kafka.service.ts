import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService
  ) {
    this.kafka = new Kafka({
      clientId: this.configService.getOrThrow<string>('KAFKA_CLIENT_ID'),
      brokers: [this.configService.getOrThrow<string>('KAFKA_BROKER')]
      // brokers: ['localhost:9092']
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.configService.getOrThrow<string>('KAFKA_GROUP_ID')
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();

    // Subscribe to topics
    await this.consumer.subscribe({ topic: KafkaTopicEnum.General, fromBeginning: true });
    await this.consumer.subscribe({ topic: KafkaTopicEnum.Specific, fromBeginning: true });

    // // Run the consumer
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = `Received message: topic = ${topic}, partition = ${partition} message = ${JSON.stringify(message)}`;
        Logger.log(data);
        await this.logService.createLog({ message: data, type: LogTypeEnum.Kafka });
      }
    });
  }

  async onModuleDestroy() {
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
    return generalResponse('success', { dto });
  }
}
