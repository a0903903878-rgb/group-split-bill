import { Controller, Get, Param, Req } from '@nestjs/common';
import { SettlementsService } from './settlements.service';

@Controller('groups/:groupId/settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Get()
  getSettlement(@Param('groupId') groupId: string, @Req() req: any) {
    return this.settlementsService.calculate(groupId, req.user?.userId);
  }
}
