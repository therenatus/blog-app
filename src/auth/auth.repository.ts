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
        $or: [{ 'accountData.login': term }, { 'accountData.email': term }],
      })
      .select('+accountData.password');
  }
}
