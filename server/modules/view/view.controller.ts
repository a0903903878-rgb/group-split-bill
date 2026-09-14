import { Controller, Get } from '@nestjs/common';

@Controller('view')
export class ViewController {
  @Get()
  getView() {
    return { name: '群组分账助手', version: '2.3.0' };
  }
}
