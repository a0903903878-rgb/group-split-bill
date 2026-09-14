import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello() {
    return { message: 'Hello from 群组分账助手 API!' };
  }
}
