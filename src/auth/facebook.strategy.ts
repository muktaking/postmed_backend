import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
import * as generator from 'generate-password';
import { Profile, Strategy } from 'passport-facebook';
import { IdentityStatus, LoginProvider, User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { to } from 'src/utils/utils';

const facebookConfig = config.get('facebook');
const jwtConfig = config.get('jwt');

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {
    super({
      clientID: process.env.APP_ID || facebookConfig.app_id,
      clientSecret: process.env.APP_SECRET || facebookConfig.app_secret,
      callbackURL: 'http://localhost:4000/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { id, name, emails } = profile;
    let payload;
    const [err, user] = await to(this.userRepository.findOne({ fbId: id }));
    if (err) throw new InternalServerErrorException();
    if (user) {
      if (user.indentityStatus == IdentityStatus.checked) {
        payload = {
          email: user.email,
          id: user.id,
          role: user.role,
        };
        accessToken = await this.jwtService.sign(payload);
        return {
          accessToken,
          id: user.id,
          expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
        };
      } else {
        throw new UnauthorizedException(
          'Admin does not approve you. Please contact with admin.'
        );
      }
    } else {
      const newUser = new User();
      newUser.fbId = id;
      newUser.firstName = name.givenName;
      newUser.lastName = name.familyName;
      newUser.email = emails[0].value;
      newUser.userName = name.givenName;
      newUser.password = generator
        .generateMultiple(3, {
          length: 10,
          uppercase: false,
        })
        .toString();
      newUser.loginProvider = LoginProvider.facebook;
      newUser.identityStatus = IdentityStatus.unchecked;
      newUser.avatar = 'boy';
      const [err, result] = await to(newUser.save());
      console.log(err);
      if (err) throw new InternalServerErrorException();
    }

    // const { name, emails } = profile;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    // };

    done(null, payload);
  }
}
