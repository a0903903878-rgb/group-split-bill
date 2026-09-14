import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('groups/:groupId/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  getExpenses(
    @Param('groupId') groupId: string,
    @Req() req: any,
    @Body('category') category?: string,
  ) {
    return this.expensesService.getExpenses(groupId, req.user?.userId, category);
  }

  @Get(':id')
  getExpenseDetail(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.expensesService.getExpenseDetail(groupId, id, req.user?.userId);
  }

  @Post()
  createExpense(
    @Param('groupId') groupId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.expensesService.createExpense(groupId, body, req.user?.userId);
  }

  @Put(':id')
  updateExpense(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.expensesService.updateExpense(groupId, id, body, req.user?.userId);
  }

  @Delete(':id')
  deleteExpense(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.expensesService.deleteExpense(groupId, id, req.user?.userId);
  }
}
