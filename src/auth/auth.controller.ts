import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { RegistrationDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() userId: string) {
    return this.service.login(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@User() userId: string) {
    return userId;
  }

  @UseGuards(BasicAuthGuard)
  @Get('for-sa')
  async forSA() {
    return 'admin';
  }

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() dto: RegistrationDto) {
    return this.service.registration(dto);
  }
}
