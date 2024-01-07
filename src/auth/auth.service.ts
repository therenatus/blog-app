import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
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

  async login(userId: string) {
    const payload = { id: userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
