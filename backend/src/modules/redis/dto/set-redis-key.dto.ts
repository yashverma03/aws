import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class SetRedisKeyDto {
  /**
   * The key to be set in Redis.
   * @example id
   */
  @IsString()
  @Length(1, 300)
  key: string;

  /**
   * The value to be set in Redis.
   * @example 1
   */
  @IsString()
  @Length(1, 10240)
  value: string;

  /**
   * The time to live (in seconds) for the key-value pair.
   * @example 3600
   */
  @IsOptional()
  @IsInt()
  ttl?: number;
}
