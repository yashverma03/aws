import { IsEnum, IsString, Length } from 'class-validator';
import { LogTypeEnum } from '../../../enums/log-type.enum';

export class CreateLogDto {
  /**
   * Log message
   * @example 'success'
   */
  @IsString()
  @Length(1, 255)
  message: string;

  /**
   * Log type
   * @example general
   */
  @IsEnum(LogTypeEnum)
  type: LogTypeEnum;
}
