import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import * as config from "config";
import * as crypto from "crypto";
import * as _ from "lodash";
import * as nodemailer from "nodemailer";
import { UserRepository } from "src/users/user.repository";
import { to } from "src/utils/utils";
import { MoreThan } from "typeorm";
import { UsersService } from "../users/users.service";
import { jwtPayload } from "./jwt.interface";
const moment = require("moment");

const jwtConfig = config.get("jwt");
const emailConfig = config.get("email");
const baseSiteConfig = config.get("base_site");

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    let user = await this.usersService.findOneUser(email, false, true);

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      user = isValid ? _.pick(user, ["email", "role", "id"]) : null;
      return user;
    }

    return null;
  }

  async login(user: any): Promise<{ accessToken; id; expireIn }> {
    const payload: jwtPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.sign(payload);
    return {
      accessToken,
      id: user.id,
      expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
    };
  }

  async reset(email: string) {
    console.log(email);
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        throw new InternalServerErrorException();
      }

      const token = buffer.toString("hex");
      this.userRepository
        .findOne({ email })
        .then((user) => {
          if (!user) {
            throw new HttpException(
              "User is not available",
              HttpStatus.NOT_FOUND
            ); // DO SOME RENDER PAGE
          }
          user.resetToken = token;
          user.resetTokenExpiration = moment()
            .add(3 * 60 * 60 * 1000, "milliseconds")
            .format("YYYY-MM-DD HH:mm:ss");
          user
            .save()
            .then((saved) => {
              // create reusable transporter object using the default SMTP transport
              let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || emailConfig.host,
                port: process.env.EMAIL_PORT || emailConfig.port,
                secure: process.env.IS_SECURE || emailConfig.is_secure, // true for 465, false for other ports
                auth: {
                  user: process.env.EMAIL_USER || emailConfig.user, // generated ethereal user
                  pass: process.env.EMAIL_PASSWORD || emailConfig.password, // generated ethereal password
                },
                tls: {
                  rejectUnauthorized: false,
                },
              });

              // setup email data with unicode symbols
              let mailOptions = {
                from: `"No-reply" <${process.env.EMAIL_USER ||
                  emailConfig.user}>`, // sender address
                to: email, // list of receivers
                subject: "Reset Your Password, ", // Subject line
                html: `<h3>Reset Your Password</h3>
                          <p>If you request for password reset, click this <a href="${process
                            .env.BASE_SITE_URL ||
                            baseSiteConfig.url}/reset/${token}">reset link</a></p>
                  `, // html body
              };
              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                }
                console.log(info);
              });
              return { message: "Reset password successfull" };
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async resetPassword(token: number, password: string) {
    const newPassword = password;
    const passwordToken = token;

    const [err, user] = await to(
      this.userRepository.findOne({
        where: {
          resetToken: passwordToken,
          resetTokenExpiration: MoreThan(
            moment().format("YYYY-MM-DD HH:mm:ss")
          ),
        },
      })
    );

    if (err) {
      throw new InternalServerErrorException();
    }

    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetToken = null;
      user.resetTokenExpiration = undefined;
      await user.save();
      return { message: "Password reset Successfully" };
    } else {
      throw new HttpException(
        "Password Can not be resetted. Reset token may ne expired",
        HttpStatus.GONE
      );
    }
  }
}
