import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role } from 'src/roles.decorator';
import { csvFileFilter, editFileName } from 'src/utils/file-uploading.utils';
import { RolePermitted } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Req() req): Promise<any> {
    return await this.userService.findOneUser(req.user.email);
  }

  @Post('/avatar/:name')
  @UseGuards(AuthGuard('jwt'))
  async changeAvatar(@Req() req, @Param('name') name): Promise<any> {
    return await this.userService.changeAvatar(req.user.id, name);
  }

  @Post('/files')
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: editFileName,
      }),
      fileFilter: csvFileFilter,
    })
  )
  async createUsersByUpload(@Res() res, @UploadedFile() file: string) {
    return await this.userService.createUsersByUpload(res, file);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  async editUser(@Body() editUser): Promise<any> {
    return await this.userService.editUser(editUser);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  async deleteUser(@Param('id') id) {
    return await this.userService.deleteUser(id);
  }

  // @Get("all")
  // async getAlltUsers(): Promise<any> {
  //   return await this.userService.findAllUsers();
  // }

  // @Get("all")
  // async geAlltUsers(): Promise<any> {
  //   return await this.userService.findAllUsers();
  // }
}
