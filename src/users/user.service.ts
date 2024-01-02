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

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.userBusinessLayer.createUser(dto);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repository.deleteUser(id);
  }
}
