import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { deleteIDandV } from '../helpers/simplefy';

@Injectable()
export class UserBusinessLayer {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userModel.makeInstance(dto);
    const createdUser = await user.save();
    return deleteIDandV(createdUser);
  }
}
