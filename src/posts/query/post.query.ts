import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schema/post.schema';
import { Model } from 'mongoose';
import { QueryBuilder } from '../../blogs/helpers';
import { QueryType } from '../../types/query.type';
import { PaginationResponse } from '../../types/pagination-response.type';

@Injectable()
export class PostQuery {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async getAllPosts(
    query: any,
    id?: string,
  ): Promise<PaginationResponse<Post[]>> {
    const getQueries = QueryBuilder(query);
    const { sortDirection, pageSize, pageNumber, sortBy } = getQueries;
    const filter: any = {};
    if (id) {
      filter.blogId = id;
    }
    const sortOptions: { [key: string]: any } = {};
    sortOptions[sortBy as string] = sortDirection;
    const posts = await this.PostModel.find(filter, { _id: 0, __v: 0 })
      .sort(sortOptions)
      .skip(+pageSize * (pageNumber - 1))
      .limit(+pageSize)
      .exec();
    const count = await this.PostModel.find(filter).countDocuments();
    const postsWithLikes = await Promise.all(
      posts.map((post) => {
        const simplePost = JSON.parse(JSON.stringify(post));
        const likesInfo = {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        };
        return {
          ...simplePost,
          likesInfo: likesInfo,
        };
      }),
    );
    return this.pagination(postsWithLikes, count, getQueries);
  }

  private pagination(posts: Post[], count: number, filter: QueryType) {
    const pagination: PaginationResponse<Post[]> = {
      page: filter.pageNumber,
      totalCount: count,
      pagesCount: Math.ceil(count / filter.pageSize),
      pageSize: filter.pageSize,
      items: posts,
    };
    return pagination;
  }
}
