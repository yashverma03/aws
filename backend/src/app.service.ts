import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      message: 'success',
      data: {
        status: 'ok',
        timestamp: new Date()
      }
    };
  }
}
