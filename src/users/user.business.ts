import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';

import { User, UserModelType } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserViewMapper } from '../helpers/user-view.mapper';

@Injectable()
export class UserBusinessLayer {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async createUser(dto: CreateUserDto) {
    const confirmationCode = randomUUID();
    const userInstance = this.userModel.makeInstance(dto, confirmationCode);
    const createdUser = await userInstance.save();
    const account = UserViewMapper(createdUser);
    const { password, ...user } = account;
    return user;
  }
}
