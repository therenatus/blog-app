import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserBusinessLayer } from './user.business';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly userBusinessLayer: UserBusinessLayer,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.repository.getUserByEmail(dto.email);
    if (user) {
      return null;
    }
    return this.userBusinessLayer.createUser(dto);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    if (!user) {
      return false;
    }
    return this.repository.deleteUser(id);
  }
}
