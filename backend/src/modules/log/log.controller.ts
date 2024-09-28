import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { GetLogsDto } from './dto/get-logs.dto';

@ApiTags('Logs')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  /**
   * Get paginated list of all logs
   */
  @Get()
  async getLogs(@Query() dto: GetLogsDto) {
    return await this.logService.getLogs(dto);
  }

  /**
   * Create a new log
   */
  @Post()
  async createLog(@Body() dto: CreateLogDto) {
    return await this.logService.createLog(dto);
  }
}
