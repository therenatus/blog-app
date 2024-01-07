import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { User } from '../users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string) {
    const user = await this.repository.findOneByLoginOrEmail(login);
    if (user && user.password === pass) {
      const { password, ...result } = JSON.parse(JSON.stringify(user));
      return result;
    }
    return null;
  }

  async login(user: User) {
    console.log(user);
    const payload = { id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
