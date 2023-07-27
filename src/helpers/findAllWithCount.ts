import {IQuery} from "../types/query.interface";
import {TResponseWithData} from "../types/respone-with-data.type";
import {Collection, Document, WithId} from "mongodb";

//@ts-ignore
export async function FindAllWithCount<T>(query: IQuery, collection: Collection<T>, id: string | null): Promise<TResponseWithData<WithId<T>[], number, 'data', 'totalCount'>> {
  const {searchNameTerm, sortDirection, pageSize, pageNumber, sortBy, searchEmailTerm, searchLoginTerm} = query;
  let filter: any = {}
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;
  const orConditions = [];

  if (searchNameTerm) {
    filter = {'accountData.name': { $regex: searchNameTerm, $options: "i" }};
  }

  if (searchEmailTerm) {
    orConditions.push({ 'accountData.email': { $regex: searchEmailTerm, $options: "i" } });
  }

  if (searchLoginTerm) {
    orConditions.push({ 'accountData.login': { $regex: searchLoginTerm, $options: "i" } });
  }

  if (orConditions.length > 0) {
    filter.$or = orConditions;
  }

  if(id) {
    filter.accountData.blogId = id;
  }
  console.log(filter)
  const total = await collection.countDocuments(filter);
  const data =  await collection
    .find(filter, {projection: { 'accountData.hashPassword': 0}})
    .sort(sortOptions)
    .skip(+pageSize * (pageNumber - 1))
    .limit(+pageSize)
    .toArray();

  return {data: data, totalCount: total}
}