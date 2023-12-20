import { IQuery } from "../types/query.interface";
import { TResponseWithData } from "../types/respone-with-data.type";
import { IPost } from "../types/post.interface";
import { ObjectId, WithId } from "mongodb";
import { PostModel } from "../model/post.model";
import { injectable } from "inversify";

@injectable()
export class PostRepository {
  async find(
    query: IQuery,
  ): Promise<TResponseWithData<WithId<IPost>[], number, "data", "totalCount">> {
    return await postPagination(query);
  }

  async findOne(id: string | ObjectId): Promise<IPost | null> {
    let findBy: any;
    ObjectId.isValid(id)
      ? (findBy = { _id: new ObjectId(id) })
      : (findBy = { id });
    return PostModel.findOne(findBy, { _id: 0 }).lean();
  }

  async create(body: IPost): Promise<IPost | null> {
    return PostModel.create(body);
  }

  async update(id: string, body: any): Promise<IPost | boolean> {
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
): Promise<TResponseWithData<WithId<IPost>[], number, "data", "totalCount">> {
  const { sortDirection, pageSize, pageNumber, sortBy } = query;
  let filter: any = {};
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;

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
