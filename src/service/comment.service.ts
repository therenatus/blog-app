import {
  CommentResponseType,
  CommentType,
  LikeStatus,
} from "../types/comment.interface";
import { CommentUserMapping } from "../helpers/comment-user-mapping";
import { CommentRepository } from "../repositories/comment.repository";
import { UserRepository } from "../repositories/user.repository";
import { StatusEnum } from "../types/status.enum";
import { PostRepository } from "../repositories/post.repository";
import { CreateCommentDto } from "../controller/dto/create-comment.dto";
import { CommentModel } from "../model/comment.model";
import { JwtService } from "../helpers/jwtService";

export class CommentService {
  constructor(
    protected repository: CommentRepository,
    protected userRepository: UserRepository,
    protected postRepository: PostRepository,
    protected jwtService: JwtService,
  ) {}

  async createComment(
    postId: string,
    body: CreateCommentDto,
    userId: string,
  ): Promise<CommentResponseType | boolean> {
    const newComment = new CommentModel();
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      return false;
    }
    const author = await this.userRepository.findOneById(userId);
    if (!author) {
      return false;
    }
    newComment.commentatorId = userId;
    newComment.id = (+new Date()).toString();
    newComment.postId = postId;
    newComment.createdAt = new Date();
    newComment.content = body.content;

    const com = await this.repository.updateComment(newComment);
    const commentWithUser = CommentUserMapping(com, author);
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

  async updateLikes(commentId: string, userId: string, status: LikeStatus) {
    const comment = await this.repository.findOneWithLike(
      commentId,
      userId,
      false,
    );
    console.log("comment with like", comment);
    if (comment === null) {
      const commentt = await this.repository.findSmartOne(commentId);
      console.log("commentt without like", commentt);
      if (!commentt) {
        return false;
      }
      commentt.likesAuthors.push({
        userId: userId,
        status: status,
      });
      if (status === LikeStatus.LIKE) {
        commentt.likesInfo.likesCount += 1;
      } else if (status === LikeStatus.DISLIKE) {
        commentt.likesInfo.dislikesCount += 1;
      }
      return await this.repository.updateComment(commentt);
    }
    if (
      comment.likesAuthors.length >= 1 &&
      comment.likesAuthors[0].status !== status
    ) {
      comment.likesAuthors[0].status = status;
      if (status === LikeStatus.LIKE) {
        comment.likesInfo.likesCount += 1;
        comment.likesInfo.dislikesCount -= 1;
      } else if (status === LikeStatus.DISLIKE) {
        comment.likesInfo.likesCount -= 1;
        comment.likesInfo.dislikesCount += 1;
      }
      return await this.repository.updateComment(comment);
    }
    if (comment.likesAuthors[0].status === status) {
      return await this.repository.updateComment(comment);
    }
  }

  async getOne(
    id: string,
    auth: string | undefined,
  ): Promise<CommentResponseType | StatusEnum> {
    let userId: { id: string } | null;
    let comment: CommentType | null;
    if (auth) {
      userId = await this.jwtService.getUserByToken(auth.split(" ")[1]);
    } else {
      userId = null;
    }
    if (userId) {
      comment = await this.repository.findOneWithLike(id, userId.id, true);
    } else {
      comment = await this.repository.findOne(id);
    }
    // const comment = userId
    //   ? await this.repository.findOneWithLike(id, userId.id, true)
    //   : await this.repository.findOne(id);
    // const comment = await this.repository.findOne(id);
    // const commentWithMyLike = await this.repository.findOneWithLike(id, userId.id, true)
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
