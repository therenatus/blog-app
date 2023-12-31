import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../schema/user.schema';
import { QueryBuilder } from '../../blogs/helpers';
import { PaginationResponse } from '../../types/pagination-response.type';
import { QueryType } from '../../types/query.type';

@Injectable()
export class UserQuery {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async getAllUsers(query: any): Promise<PaginationResponse<User[]>> {
    const querySearch = QueryBuilder(query);
    const {
      searchEmailTerm,
      searchLoginTerm,
      searchNameTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    } = querySearch;

    const sortOptions: { [key: string]: any } = {};
    sortOptions[sortBy as string] = sortDirection;
    const filter: any = {};
    const orConditions: any = [];

    if (searchNameTerm) {
      orConditions.push({
        name: { $regex: searchNameTerm, $options: 'i' },
      });
    }

    if (searchEmailTerm) {
      orConditions.push({
        email: { $regex: searchEmailTerm, $options: 'i' },
      });
    }

    if (searchLoginTerm) {
      orConditions.push({
        login: { $regex: searchLoginTerm, $options: 'i' },
      });
    }

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    const totalCount = await this.userModel.find(filter).countDocuments();
    const users = await this.userModel
      .find(filter, { _id: 0, __v: 0 })
      .sort(sortOptions)
      .skip(+pageSize * (pageNumber - 1))
      .limit(+pageSize)
      .exec();
    return this.pagination(users, totalCount, querySearch);
  }

  private pagination(
    data: User[],
    totalCount: number,
    query: QueryType,
  ): PaginationResponse<User[]> {
    const { pageSize, pageNumber } = query;
    return {
      page: pageNumber,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
      items: data,
    };
  }
}
