import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../schema/blog.schema';
import { Model } from 'mongoose';
import { QueryType } from '../../types/query.type';
import { QueryBuilder } from '../helpers';
import { PaginationResponse } from '../../types/pagination-response.type';

@Injectable()
export class BlogQuery {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}
  async getAllBlogs(query: any) {
    const querySearch = QueryBuilder(query);
    let { sortBy, sortDirection } = querySearch;
    const { searchNameTerm, pageSize, pageNumber } = querySearch;

    sortBy = sortBy || 'createdAt';
    sortDirection = sortDirection || 'desc';
    const sortOptions: { [key: string]: any } = {};
    sortOptions[sortBy] = sortDirection === 'desc' ? -1 : 1;
    let filter: any = {};
    if (searchNameTerm) {
      filter = {
        name: { $regex: searchNameTerm, $options: 'i' },
      };
    }
    const blogs = await this.BlogModel.find(filter, { _id: 0, __v: 0 })
      .sort(sortOptions)
      .skip(+pageSize * (pageNumber - 1))
      .limit(+pageSize)
      .exec();
    const count = await this.BlogModel.find(filter).countDocuments();
    return this.pagination(blogs, count, querySearch);
  }

  private pagination(blogs: Blog[], count: number, filter: QueryType) {
    const pagination: PaginationResponse<Blog[]> = {
      page: filter.pageNumber,
      totalCount: count,
      pagesCount: Math.ceil(count / filter.pageSize),
      pageSize: filter.pageSize,
      items: blogs,
    };
    return pagination;
  }
}
