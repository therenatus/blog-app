import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { deleteIDandV } from '../helpers/simplefy';

@Injectable()
export class UserBusinessLayer {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const userInstance = this.userModel.makeInstance(dto);
    const createdUser = await userInstance.save();
    const newUser = deleteIDandV(createdUser);
    const { password, ...user } = newUser;
    return user;
  }
}
