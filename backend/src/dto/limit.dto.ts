import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * DTO to add limit to the number of elements returned in the response data.
 * Useful when response data is an array
 */
export class LimitDto {
  /**
   * Maximum number of elements returned in the response.
   * @example 10
   */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsInt()
  limit: number = 10;
}
