import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
//import { Model } from "mongoose";
import * as config from "config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

const jwtConfig = config.get("jwt");

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    return { email: payload.email, id: payload.id, role: payload.role };
  }
}
