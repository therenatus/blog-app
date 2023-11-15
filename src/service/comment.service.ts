import { IComment, ICommentResponse } from "../types/comment.interface";
import { CommentUserMapping } from "../helpers/comment-user-mapping";
import { CommentRepository } from "../repositories/comment.repository";
import { UserRepository } from "../repositories/user.repository";
import { StatusEnum } from "../types/status.enum";
import { PostRepository } from "../repositories/post.repository";
import { CreateCommentDto } from "../controller/dto/create-comment.dto";

const commentRepository = new CommentRepository();
const userRepository = new UserRepository();
const postRepository = new PostRepository();

export class CommentService {
  async createComment(
    postId: string,
    body: CreateCommentDto,
    userId: string,
  ): Promise<ICommentResponse | boolean> {
    const post = await postRepository.findOne(postId);
    if (!post) {
      return false;
    }
    const author = await userRepository.findOneById(userId);
    if (!author) {
      return false;
    }
    const newComment: IComment = {
      ...body,
      id: (+new Date()).toString(),
      createdAt: new Date(),
      postId: postId,
      commentatorId: userId,
    };

    const comment = await commentRepository.create(newComment);
    if (!comment) {
      return false;
    }
    const commentWithUser = CommentUserMapping(comment, author);
    if (!commentWithUser) {
      return false;
    }
    return commentWithUser;
  }

  async update(body: any, id: string, userId: string): Promise<StatusEnum> {
    const comment = await commentRepository.findOne(id);
    if (!comment) {
      return StatusEnum.NOT_FOUND;
    }
    if (comment.commentatorId !== userId) {
      return StatusEnum.FORBIDDEN;
    }
    const newComment = await commentRepository.update(id, body);
    if (!newComment) {
      return StatusEnum.NOT_FOUND;
    }
    return StatusEnum.NOT_CONTENT;
  }

  async getOne(id: string): Promise<ICommentResponse | StatusEnum> {
    const comment = await commentRepository.findOne(id);
    if (comment === null) {
      return StatusEnum.NOT_FOUND;
    }
    const user = await userRepository.findOneById(comment.commentatorId);
    if (user === null) {
      return StatusEnum.NOT_FOUND;
    }
    const commentWithUser = CommentUserMapping(comment, user);
    return commentWithUser;
  }

  async deleteOne(id: string, userId: string): Promise<StatusEnum> {
    const comment = await commentRepository.findOne(id);
    if (comment === null) {
      return StatusEnum.NOT_FOUND;
    }
    if (comment.commentatorId !== userId) {
      return StatusEnum.FORBIDDEN;
    }
    const deletedComment = await commentRepository.deleteComment(id);
    if (!deletedComment) {
      return StatusEnum.NOT_FOUND;
    }
    return StatusEnum.NOT_CONTENT;
  }
}
