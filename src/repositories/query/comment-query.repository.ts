import {commentCollection} from "../../index";
import {CommentUserMapping} from "../../helpers/comment-user-mapping";
import {UserRepository} from "../user.repository";
import {QueryBuilder} from "../../helpers/query-builder";
import {TMeta} from "../../types/meta.type";
import {DataWithPagination} from "../../helpers/data-with-pagination";
import {PostRepository} from "../post.repository";

const userRepository = new UserRepository();
const postRepository = new PostRepository();

type Props = {
  query: any,
  postId: string
}
export const CommentQueryRepository = async({query, postId}: Props) => {
  const post = await postRepository.findOne(postId);
  if(!post){
    return false;
  }
  const querySearch = QueryBuilder(query);
  const meta: TMeta = {
    ...querySearch,
    totalCount: 0
  };
  const {sortDirection, pageSize, pageNumber, sortBy} = querySearch;
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;

  const total = await commentCollection.countDocuments({postId: postId});
  meta.totalCount = total;
  const data = await commentCollection
    .find({postId: postId}, {projection: { postId: 0, _id: 0}})
    .sort(sortOptions)
    .skip(+pageSize * (pageNumber - 1))
    .limit(+pageSize)
    .toArray();
  const commentWithUsers = await Promise.all(data.map(async(comment) => {
    const author = await userRepository.findOneById(comment.commentatorId);
    return CommentUserMapping(comment, author!);
  }));
  const dataWithPagination = DataWithPagination({items: commentWithUsers, meta: meta})
  return dataWithPagination;
}
