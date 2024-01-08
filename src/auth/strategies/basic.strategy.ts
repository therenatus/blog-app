import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { basicAuthConst } from '../constants';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string) {
    if (
      basicAuthConst.secret.login === username &&
      basicAuthConst.secret.password === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
