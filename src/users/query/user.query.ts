import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../schema/user.schema';
import { QueryBuilder } from '../../blogs/helpers';
import { PaginationResponse } from '../../types/pagination-response.type';
import { QueryType } from '../../types/query.type';
import { UserViewMapper } from '../../helpers/user-view.mapper';

@Injectable()
export class UserQuery {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async getAllUsers(query: any): Promise<PaginationResponse<User[]>> {
    const querySearch = QueryBuilder(query);
    let { sortBy, sortDirection } = querySearch;
    const {
      searchEmailTerm,
      searchNameTerm,
      searchLoginTerm,
      pageSize,
      pageNumber,
    } = querySearch;

    sortBy = sortBy || 'createdAt';
    sortDirection = sortDirection || 'desc';
    const sortOptions: { [key: string]: any } = {};
    sortOptions[sortBy] = sortDirection === 'desc' ? -1 : 1;
    const filter: any = {};
    const orConditions: any = [];

    if (searchNameTerm) {
      orConditions.push({
        'accountData.name': { $regex: searchNameTerm, $options: 'i' },
      });
    }

    if (searchEmailTerm) {
      orConditions.push({
        'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
      });
    }

    if (searchLoginTerm) {
      orConditions.push({
        'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
      });
    }

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }
    const userResponse: any[] = [];
    const totalCount = await this.userModel.find().countDocuments();
    const users = await this.userModel
      .find(filter, { __v: 0 })
      .sort(sortOptions)
      .skip(+pageSize * (pageNumber - 1))
      .limit(+pageSize)
      .exec();
    console.log(users);
    users.map((user) => userResponse.push(UserViewMapper(user)));
    return this.pagination(userResponse, totalCount, querySearch);
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
