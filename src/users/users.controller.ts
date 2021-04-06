import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async getUserById(@Req() req): Promise<any> {
    return await this.userService.findOneUser(req.user.email);
  }

  @Post("/avatar/:name")
  @UseGuards(AuthGuard("jwt"))
  async changeAvatar(@Req() req, @Param("name") name): Promise<any> {
    return await this.userService.changeAvatar(req.user.id, name);
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
