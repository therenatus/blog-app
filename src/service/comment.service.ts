import { CommentResponseType } from "../types/comment.type";
import { CommentUserMapping } from "../helpers/comment-user-mapping";
import { CommentRepository } from "../repositories/comment.repository";
import { UserRepository } from "../repositories/user.repository";
import { StatusEnum } from "../types/status.enum";
import { PostRepository } from "../repositories/post.repository";
import { CreateCommentDto } from "../controller/dto/create-comment.dto";
import { JwtService } from "../helpers/jwtService";
import { injectable } from "inversify";
import { CommentBusinessLayer } from "../buisness/comment.business";
import { CommentModel } from "../model/comment.model";
import { LikeStatus } from "../types/like.type";

@injectable()
export class CommentService {
  constructor(
    protected repository: CommentRepository,
    protected userRepository: UserRepository,
    protected postRepository: PostRepository,
    protected jwtService: JwtService,
    protected commentBusinessLayer: CommentBusinessLayer,
  ) {}

  async createComment(
    postId: string,
    body: CreateCommentDto,
    userId: string,
  ): Promise<CommentResponseType | boolean> {
    const author = await this.commentBusinessLayer.verifyToCreate(
      postId,
      userId,
    );
    if (!author) return false;

    const newComment = CommentModel.makeInstance(body, postId, userId);

    const comment = await this.repository.save(newComment);
    return this.commentBusinessLayer.commentWithUser(comment, author);
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

  async updateLikes(commentId: string, userId: string, status: LikeStatus) {
    const comment = await this.commentBusinessLayer.prepareCommentForLike(
      commentId,
      userId,
      status,
    );
    if (!comment) {
      return null;
    }

    return this.repository.save(comment);
  }

  async getOne(
    id: string,
    auth: string | undefined,
  ): Promise<CommentResponseType | StatusEnum> {
    const userId = await this.commentBusinessLayer.getUserIdFromAuth(auth);
    let comment = await this.commentBusinessLayer.getCommentForUser(id, userId);
    if (comment === null) {
      return StatusEnum.NOT_FOUND;
    }
    if (!userId) {
      comment.likesAuthors = [];
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
