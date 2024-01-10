import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByLoginOrEmail(term: string) {
    return this.userModel
      .findOne({
        $or: [{ login: term }, { email: term }],
      })
      .select('+password');
  }
}
