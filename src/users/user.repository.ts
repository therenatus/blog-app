import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async getUserById(id: string) {
    return this.userModel.findOne({ 'accountData.id': id });
  }

  async deleteUser(id: string): Promise<boolean> {
    const { deletedCount } = await this.userModel.deleteOne({ id });
    return deletedCount === 1;
  }
}
