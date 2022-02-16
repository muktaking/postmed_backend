import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { RolePermitted } from 'src/users/user.entity';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  async findAllGeneralNotification(@Body('options') options) {
    console.log(options);
    return await this.notificationService.findAllGeneralNotification(options);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  @UsePipes(ValidationPipe)
  async createNotification(
    @Body() createNotification: CreateNotificationDto,
    @Req() req
  ) {
    return await this.notificationService.createNotification(
      createNotification,
      req.user
    );
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  @UsePipes(ValidationPipe)
  async updateNotification(
    @Body() createNotification: CreateNotificationDto,
    @Req() req
  ) {
    return await this.notificationService.updateNotification(
      createNotification,
      req.user
    );
  }
}
