import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HelloModule } from './modules/hello/hello.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { SettlementsModule } from './modules/settlements/settlements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelloModule,
    GroupsModule,
    ExpensesModule,
    SettlementsModule,
  ],
})
export class AppModule {}
