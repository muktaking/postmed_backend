import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('/registration')
  async signUp(@Body(ValidationPipe) createUserDto: createUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async logIn(
    // @Body("email", ValidationPipe) email: string,
    // @Body("password", ValidationPipe) password: string,
    @Req() req
  ) {
    return await this.authService.login(req.user);
    //return await this.usersService.validateUser(email, password);
  }

  @Post('/facebook')
  async facebookLogin(@Body() data): Promise<any> {
    //console.log(data.fbApi);
    return await this.authService.facebookLoginAutoLog(data.fbApi);
  }

  @Post('/reset')
  async reset(@Body('email') email: string) {
    return await this.authService.reset(email);
    //return await this.usersService.validateUser(email, password);
  }

  @Post('/reset/:id')
  async resetPassword(@Body() reset: { token: number; password: string }) {
    return await this.authService.resetPassword(reset.token, reset.password);
    //return await this.usersService.validateUser(email, password);
  }
}
