import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  getGroups(@Req() req: any) {
    return this.groupsService.getGroups(req.user?.userId);
  }

  @Get(':id')
  getGroupDetail(@Param('id') id: string, @Req() req: any) {
    return this.groupsService.getGroupDetail(id, req.user?.userId);
  }

  @Post()
  createGroup(@Body() body: { name: string; description?: string }, @Req() req: any) {
    return this.groupsService.createGroup(body, req.user?.userId);
  }

  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; nickname?: string },
    @Req() req: any,
  ) {
    return this.groupsService.addMember(id, body, req.user?.userId);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: any,
  ) {
    return this.groupsService.removeMember(id, userId, req.user?.userId);
  }
}
