import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { LogTypeEnum } from '../../../interfaces/log-type.enum';
import { PaginationDto } from '../../../dto/pagination.dto';

export class GetLogsDto extends PaginationDto {
  /**
   * Log ID of the log
   * @example 1
   */
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  logId?: string;

  /**
   * Log type
   * @example general
   */
  @IsOptional()
  @IsEnum(LogTypeEnum)
  type?: LogTypeEnum;
}
