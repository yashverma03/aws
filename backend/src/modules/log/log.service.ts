import { Injectable } from '@nestjs/common';
import { Log } from '../../entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetLogsDto } from './dto/get-logs.dto';
import { CreateLogDto } from './dto/create-log.dto';
import { getResponse, insertResponse } from '../../utils/response.util';
import { Pagination } from '../../utils/pagination.util';

@Injectable()
export class LogService {
  constructor(@InjectRepository(Log) private readonly logRepo: Repository<Log>) {}

  /**
   * Get paginated list of all logs
   */
  async getLogs(dto: GetLogsDto) {
    const { page, limit, logId, type } = dto;
    const offset = Pagination.calculateOffset(page, limit);
    const query = this.logRepo
      .createQueryBuilder('log')
      .offset(offset)
      .limit(limit)
      .orderBy('"logId"', 'DESC');

    if (logId) {
      query.andWhere('log.logId = :logId', { logId });
    }

    if (type) {
      query.andWhere('log.type = :type', { type });
    }

    const [logs, count] = await query.getManyAndCount();
    const meta = new Pagination(page, limit, count);
    return getResponse(logs, meta);
  }

  /**
   * Create a new log
   */
  async createLog(dto: CreateLogDto) {
    const log = await this.logRepo.insert(dto);
    return insertResponse(log);
  }
}
