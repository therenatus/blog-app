import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserBusinessLayer {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userModel.makeInstance(dto);
    return user.save();
  }
}
