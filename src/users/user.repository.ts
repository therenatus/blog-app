import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async deleteUser(id: string): Promise<boolean> {
    const { deletedCount } = await this.userModel.deleteOne({ id });
    return deletedCount === 1;
  }
}
