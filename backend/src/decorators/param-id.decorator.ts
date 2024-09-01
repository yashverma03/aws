import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { isNumberString } from 'class-validator';

/** Gets param from request params. Also validates that all params are number string */
export const ParamId = createParamDecorator(
  (paramName: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { params } = request;

    // Validate that all params are number string
    for (const key in params) {
      if (!isNumberString(params[key], { no_symbols: true })) {
        throw new BadRequestException(`${key}_must_be_a_number_string`);
      }
    }

    return paramName ? params[paramName] : params;
  },
);
