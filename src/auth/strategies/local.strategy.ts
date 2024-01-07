import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';
import passport from 'passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(login: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(login, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
