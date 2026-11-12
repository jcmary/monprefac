import { Body, Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Body() body: { fullName: string, bio: string }, @Req() req: any) {
    return this.usersService.updateProfile(req.user.userId, body.fullName, body.bio);
  }

  @Get('teacher/:id')
  getTeacherProfile(@Param('id') id: string) {
    return this.usersService.getTeacherProfile(id);
  }
}