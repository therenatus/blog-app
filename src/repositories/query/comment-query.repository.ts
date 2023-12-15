import { CommentUserMapping } from "../../helpers/comment-user-mapping";
import { UserRepository } from "../user.repository";
import { QueryBuilder } from "../../helpers/query-builder";
import { TMeta } from "../../types/meta.type";
import { DataWithPagination } from "../../helpers/data-with-pagination";
import { PostRepository } from "../post.repository";
import { CommentModel } from "../../model/comment.model";
import { JwtService } from "../../helpers/jwtService";

const userRepository = new UserRepository();
const postRepository = new PostRepository();
const jwtService = new JwtService();

type Props = {
  query: any;
  postId: string;
  auth?: string | null;
};
export const CommentQueryRepository = async ({
  query,
  postId,
  auth,
}: Props) => {
  let userId: any | null = null;
  if (auth) {
    userId = await jwtService.getUserByToken(auth.split(" ")[1]);
  }

  const post = await postRepository.findOne(postId);
  if (!post) {
    return false;
  }
  const querySearch = QueryBuilder(query);
  const meta: TMeta = {
    ...querySearch,
    totalCount: 0,
  };
  const { sortDirection, pageSize, pageNumber, sortBy } = querySearch;
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;

  meta.totalCount = await CommentModel.countDocuments({ postId: postId });
  const data = await CommentModel.find(
    { postId: postId },
    { postId: 0, _id: 0, __v: 0 },
  )
    .sort(sortOptions)
    .skip(+pageSize * (pageNumber - 1))
    .limit(+pageSize)
    .lean();
  const commentWithUsers = await Promise.all(
    data.map(async (comment) => {
      const author = await userRepository.findOneById(comment.commentatorId);
      console.log(userId);
      const myLikes = comment.likesAuthors.find(
        (like) => like.userId === userId.id,
      );
      console.log("coditwion", userId === null || !myLikes);
      console.log(typeof myLikes);
      if (userId === null || !myLikes) {
        comment.likesAuthors = [];
      }
      if (myLikes) {
        comment.likesAuthors = [myLikes];
      }

      return CommentUserMapping(comment, author!);
    }),
  );
  return DataWithPagination({
    items: commentWithUsers,
    meta: meta,
  });
};
