import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "src/roles.decorator";
import { RolesGuard } from "src/roles.guard";
import { RolePermitted } from "src/users/user.model";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Role(RolePermitted.student)
  async getStudentDashInfo(@Req() req) {
    return await this.dashboardService.getStudentDashInfo(req.user.email);
  }

  @Get("admin")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Role(RolePermitted.mentor)
  async getAdminDashInfo(@Req() req) {
    return await this.dashboardService.getAdminDashInfo(req.user.role);
  }
}
