import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/roles.decorator';
import { RolePermitted } from 'src/users/user.entity';
import { UserExamProfileService } from './userExamprofile.service';

@Controller('userExamProfile')
export class UserExamProfileController {
  constructor(
    private readonly userExamProfileService: UserExamProfileService
  ) {}

  @Get()
  async findAllUserExamActivityStat() {
    return await this.userExamProfileService.findAllUserExamActivityStat();
  }

  @Get('/courses/:id')
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.student)
  async findAllUserExamActivityStatByCourseId(
    @Param('id') id: string,
    @Req() req
  ) {
    return await this.userExamProfileService.findAllUserExamActivityStatByCourseId(
      req.user.id,
      id
    );
  }
}
