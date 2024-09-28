import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { generalResponse, getResponse } from '../../utils/response.util';
import { SetRedisKeyDto } from './dto/set-redis-key.dto';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: +this.configService.getOrThrow<number>('REDIS_PORT'),
      password: this.configService.getOrThrow<string>('REDIS_PASSWORD')
    });
  }

  /**
   * Set a key-value pair in Redis.
   */
  async setKey(dto: SetRedisKeyDto) {
    const { key, value, ttl } = dto;
    if (ttl !== undefined) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
    return generalResponse('created', dto);
  }

  /**
   * Get a value by key from Redis.
   */
  async getKey(key: string) {
    const query = [this.redis.get(key), this.redis.ttl(key)];
    const [value, ttl] = await Promise.all(query);
    return getResponse({ value, ttl });
  }

  /**
   * Delete a key from Redis.
   */
  async deleteKey(key: string) {
    const result = await this.redis.del(key);
    return generalResponse('deleted', result);
  }

  /**
   * Get all keys and values in Redis.
   */
  async getAllKeys() {
    const keys = await this.redis.keys('*');
    const values = await this.redis.mget(keys);
    const result = keys.map((key, index) => ({ key, value: values[index] }));
    return getResponse(result);
  }
}
