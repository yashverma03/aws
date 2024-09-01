import { Injectable } from '@nestjs/common';
import { getResponse } from './utils/response.util';

@Injectable()
export class AppService {
  getHealth() {
    const timestamp = new Date();
    return getResponse({ timestamp });
  }
}
