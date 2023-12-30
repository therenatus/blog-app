import { IQuery } from "../types/query.interface";
import { TResponseWithData } from "../types/respone-with-data.type";
import { PostType } from "../types/post.type";
import { ObjectId, WithId } from "mongodb";
import { PostModel } from "../model/post.model";
import { injectable } from "inversify";
import { HydratedDocument } from "mongoose";

@injectable()
export class PostRepository {
  async save(post: HydratedDocument<PostType>): Promise<PostType> {
    return post.save();
  }
  async find(
    query: IQuery,
    blogId?: string,
  ): Promise<
    TResponseWithData<WithId<PostType>[], number, "data", "totalCount">
  > {
    return await postPagination(query, blogId);
  }

  async findOne(id: string | ObjectId): Promise<PostType | null> {
    let findBy: any;
    ObjectId.isValid(id)
      ? (findBy = { _id: new ObjectId(id) })
      : (findBy = { id });
    return PostModel.findOne(findBy, { _id: 0 }).lean();
  }

  async create(body: PostType): Promise<PostType | null> {
    return PostModel.create(body);
  }

  async update(id: string, body: any): Promise<PostType | boolean> {
    const res = await PostModel.findOneAndUpdate({ id }, { body });
    if (!res) {
      return false;
    }
    return res;
  }

  async delete(id: string): Promise<boolean> {
    const { deletedCount } = await PostModel.deleteOne({ id });
    return deletedCount !== 0;
  }
}

export async function postPagination(
  query: IQuery,
  blogId?: string,
): Promise<
  TResponseWithData<WithId<PostType>[], number, "data", "totalCount">
> {
  const { sortDirection, pageSize, pageNumber, sortBy } = query;
  let filter: any = {};
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;

  if (blogId) {
    filter.blogId = blogId;
  }

  const total = await PostModel.find(filter).countDocuments();
  const data = await PostModel.find(filter, {
    _id: 0,
    __v: 0,
  })
    .sort(sortOptions)
    .skip(+pageSize * (pageNumber - 1))
    .limit(+pageSize)
    .lean();

  return { data: data, totalCount: total };
}
