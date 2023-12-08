import { IQuery } from "../types/query.interface";
import { IBlog } from "../types/blog.interface";
import { TResponseWithData } from "../types/respone-with-data.type";
import { WithId } from "mongodb";
import { IPost } from "../types/post.interface";
import { BlogModel } from "../model/blog.model";
import { PostModel } from "../model/post.model";

export class BlogRepository {
  async find(
    query: IQuery,
  ): Promise<TResponseWithData<WithId<IBlog>[], number, "data", "totalCount">> {
    return await dataPagination(query);
  }

  async findOne(id: string): Promise<IBlog | null> {
    return await BlogModel.findOne({ id: id }, { _id: 0 }).exec();
  }

  async findBlogsPost(
    id: string,
    query: IQuery,
  ): Promise<TResponseWithData<WithId<IPost>[], number, "data", "totalCount">> {
    return await postDataPagination(query, id);
  }

  async create(body: IBlog): Promise<IBlog | null> {
    return await BlogModel.create(body);
  }

  async updateOne(id: string, body: any): Promise<boolean> {
    const blog = await BlogModel.findOneAndUpdate({ id }, { body });
    return !blog;
  }

  async deleteOne(id: string): Promise<boolean> {
    const { deletedCount } = await BlogModel.deleteOne({ id });
    return deletedCount === 1;
  }
}

export async function dataPagination(
  query: IQuery,
): Promise<TResponseWithData<WithId<IBlog>[], number, "data", "totalCount">> {
  const { sortDirection, pageSize, pageNumber, sortBy } = query;
  let filter: any = {};
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;

  const total = await BlogModel.find(filter).countDocuments();
  const data = await BlogModel.find(filter, {
    _id: 0,
    __v: 0,
  })
    .sort(sortOptions)
    .skip(+pageSize * (pageNumber - 1))
    .limit(+pageSize)
    .exec();

  return { data: data, totalCount: total };
}

export async function postDataPagination(
  query: IQuery,
  id: string,
): Promise<TResponseWithData<WithId<IPost>[], number, "data", "totalCount">> {
  const { sortDirection, pageSize, pageNumber, sortBy } = query;
  let filter: any = {};
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;

  if (id) {
    filter.blogId = id;
  }
  const total = await PostModel.countDocuments(filter);
  const data = await PostModel.find(filter)
    .sort(sortOptions)
    .skip(+pageSize * (pageNumber - 1))
    .limit(+pageSize)
    .exec();

  return { data: data, totalCount: total };
}
