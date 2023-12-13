import { IComment, ICommentResponse } from "../types/comment.interface";
import { CommentUserMapping } from "../helpers/comment-user-mapping";
import { CommentRepository } from "../repositories/comment.repository";
import { UserRepository } from "../repositories/user.repository";
import { StatusEnum } from "../types/status.enum";
import { PostRepository } from "../repositories/post.repository";
import { CreateCommentDto } from "../controller/dto/create-comment.dto";

export class CommentService {
  constructor(
    protected repository: CommentRepository,
    protected userRepository: UserRepository,
    protected postRepository: PostRepository,
  ) {}

  async createComment(
    postId: string,
    body: CreateCommentDto,
    userId: string,
  ): Promise<ICommentResponse | boolean> {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      return false;
    }
    const author = await this.userRepository.findOneById(userId);
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

    const comment = await this.repository.create(newComment);
    if (!comment) {
      return false;
    }
    const commentWithUser = CommentUserMapping(newComment, author);
    if (!commentWithUser) {
      return false;
    }
    return commentWithUser;
  }

  async update(body: any, id: string, userId: string): Promise<StatusEnum> {
    const comment = await this.repository.findOne(id);
    if (!comment) {
      return StatusEnum.NOT_FOUND;
    }
    if (comment.commentatorId !== userId) {
      return StatusEnum.FORBIDDEN;
    }
    const newComment = await this.repository.update(id, body);
    if (!newComment) {
      return StatusEnum.NOT_FOUND;
    }
    return StatusEnum.NOT_CONTENT;
  }

  async getOne(id: string): Promise<ICommentResponse | StatusEnum> {
    const comment = await this.repository.findOne(id);
    if (comment === null) {
      return StatusEnum.NOT_FOUND;
    }
    const user = await this.userRepository.findOneById(comment.commentatorId);
    if (user === null) {
      return StatusEnum.NOT_FOUND;
    }
    return CommentUserMapping(comment, user);
  }

  async deleteOne(id: string, userId: string): Promise<StatusEnum> {
    const comment = await this.repository.findOne(id);
    if (comment === null) {
      return StatusEnum.NOT_FOUND;
    }
    if (comment.commentatorId !== userId) {
      return StatusEnum.FORBIDDEN;
    }
    const deletedComment = await this.repository.deleteComment(id);
    if (!deletedComment) {
      return StatusEnum.NOT_FOUND;
    }
    return StatusEnum.NOT_CONTENT;
  }
}
