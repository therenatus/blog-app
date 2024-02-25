import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { validate0rRejectModel } from '../helpers/validateTranserObjects';
import { RegistrationDto } from './dto/registration.dto';
import { validate } from 'class-validator';
import { deleteIDandV } from '../helpers/simplefy';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../users/schema/user.schema';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectModel(User.name) private userModel: UserModelType,
  ) {}

  async validateUser(login: string, pass: string) {
    const user = await this.repository.findOneByLoginOrEmail(login);
    if (user && user.accountData.password === pass) {
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

  async registration(dto: RegistrationDto) {
    await validate0rRejectModel(dto, RegistrationDto);
    await validate(dto);
    const emailTaken = await this.repository.findOneByLoginOrEmail(dto.email);
    const loginTaken = await this.repository.findOneByLoginOrEmail(dto.login);
    if (emailTaken || loginTaken) {
      throw new BadRequestException('Email or login is already taken');
    }
    const salt = await bcrypt.genSalt(16);
    const hashPassword = await bcrypt.hash(dto.password, salt);
    const confirmationCode = randomUUID();
    dto.password = hashPassword;

    const userInstance = this.userModel.makeInstance(dto, confirmationCode);
    const createdUser = await userInstance.save();
    await this.emailService.sendConfirmMessage(
      createdUser.accountData.email,
      confirmationCode,
    );
    const newUser = deleteIDandV(createdUser);
    const { password, ...user } = newUser;
    return user;
  }
}
