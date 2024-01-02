import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationResponse } from '../types/pagination-response.type';
import { User } from './schema/user.schema';
import { UserQuery } from './query/user.query';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly query: UserQuery,
  ) {}

  @Get()
  async getAllUsers(@Query() query: any): Promise<PaginationResponse<User[]>> {
    return this.query.getAllUsers(query);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.service.createUser(dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    return this.service.deleteUser(id);
  }
}