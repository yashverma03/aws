import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ApiTags } from '@nestjs/swagger';
import { SetRedisKeyDto } from './dto/set-redis-key.dto';

@ApiTags('Redis')
@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Delete a key from Redis.
   */
  @Delete(':key')
  async deleteKey(@Param('key') key: string) {
    return await this.redisService.deleteKey(key);
  }

  /**
   * Get all keys and values in Redis.
   */
  @Get()
  async getAll() {
    return await this.redisService.getAll();
  }

  /**
   * Get a value by key from Redis.
   */
  @Get(':key')
  async getKey(@Param('key') key: string) {
    return await this.redisService.getKey(key);
  }

  /**
   * Set a key-value pair in Redis.
   */
  @Post()
  async setKey(@Body() dto: SetRedisKeyDto) {
    return await this.redisService.setKey(dto);
  }
}
