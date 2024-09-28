import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { KafkaTopicEnum } from '../../../enums/kafka-topic.enum';

export class KafkaSendMessageDto {
  /**
   * The Kafka topic to which the message will be sent.
   * @example 'general'
   */
  @IsEnum(KafkaTopicEnum)
  topic: KafkaTopicEnum;

  /**
   * The message to be sent to the specified Kafka topic.
   * @example 'Hello, Kafka!'
   */
  @IsString()
  @IsNotEmpty()
  message: string;
}
