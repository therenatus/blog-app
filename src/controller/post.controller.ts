import { Request, Response } from "express";
import { PostService } from "../service/post.service";
import { CommentService } from "../service/comment.service";
import { CommentQueryRepository } from "../repositories/query/comment-query.repository";
import { RequestType } from "../types/request.type";
import { CreatePostDto } from "./dto/create-post.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { injectable } from "inversify";
import { LikeStatus } from "../types/like.type";
import { StatusEnum } from "../types/status.enum";
import { PostBusinessLayer } from "../buisness/post.business";

@injectable()
export class PostController {
  constructor(
    protected service: PostService,
    protected commentService: CommentService,
    protected postBusinessLayer: PostBusinessLayer,
  ) {}

  async getPosts(req: Request, res: Response) {
    const auth = req.headers.authorization;
    const postResponse = await this.service.getAll(req.query, auth);
    return res.status(200).send(postResponse);
  }

  async getPost(req: Request, res: Response) {
    const auth = req.headers.authorization;
    if (!req.params.id) {
      return res.status(404).send();
    }
    const post = await this.service.getOne(req.params.id, auth);
    if (!post) {
      return res.status(404).send("Not Found");
    }
    res.status(200).send(post);
  }

  async create(req: RequestType<any, CreatePostDto>, res: Response) {
    const auth = req.headers.authorization;
    const post = await this.service.create(req.body, null, auth);
    if (post === false) {
      return res.status(404).send();
    }
    res.status(201).send(post);
  }

  async updatePost(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    const post = await this.service.update(req.params.id, req.body);
    if (!post) {
      return res.status(404).send();
    }
    res.status(204).send();
  }

  async deletePost(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    const deleted = await this.service.delete(req.params.id);
    if (!deleted) {
      return res.status(404).send();
    }
    res.status(204).send();
  }

  async createComment(req: RequestType<any, CreateCommentDto>, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    if (!req.userId) {
      return res.status(401).send();
    }
    const comment = await this.commentService.createComment(
      req.params.id,
      req.body,
      req.userId,
    );
    if (!comment) {
      return res.status(404).send();
    }
    res.status(201).send(comment);
  }

  async getPostComments(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    const auth = req.headers.authorization;
    const comment = await CommentQueryRepository({
      query: req.query,
      postId: req.params.id,
      auth,
    });
    if (!comment) {
      return res.status(404).send();
    }
    res.status(200).send(comment);
  }

  async like(
    req: Request<{ id: string }, { likeStatus: LikeStatus }>,
    res: Response,
  ) {
    const postId = req.params.id;
    const userId = req.userId;
    const status = req.body.likeStatus;
    if (!postId) {
      return res.status(404).send();
    }
    if (!userId) {
      return res.status(403).send();
    }
    const like = await this.service.like(postId, userId, status);
    if (like) {
      return res.status(404).send();
    }
    res.status(StatusEnum.NOT_CONTENT).send();
  }
}
