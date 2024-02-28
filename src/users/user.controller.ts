import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationResponse } from '../types/pagination-response.type';
import { User } from './schema/user.schema';
import { UserQuery } from './query/user.query';
import { CreateUserDto } from './dto/create-user.dto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';

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

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Res() res, @Body() dto: CreateUserDto) {
    const user = await this.service.createUser(dto);
    if (user) {
      return res.status(201).json(user);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteUser(@Res() res, @Param('id') id: string) {
    const user = await this.service.deleteUser(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(204).json();
  }
}
