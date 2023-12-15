import { Request, Response } from "express";
import { PostService } from "../service/post.service";
import { IPaginationResponse } from "../types/pagination-response.interface";
import { IPost } from "../types/post.interface";
import { CommentService } from "../service/comment.service";
import { CommentQueryRepository } from "../repositories/query/comment-query.repository";
import { RequestType } from "../types/request.type";
import { CreatePostDto } from "./dto/create-post.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";

export class PostController {
  constructor(
    protected service: PostService,
    protected commentService: CommentService,
  ) {}

  async getPosts(req: Request, res: Response) {
    const posts = await this.service.getAll(req.query);
    const { items, meta } = posts;
    const blogsResponse: IPaginationResponse<IPost[]> = {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
    return res.status(200).send(blogsResponse);
  }

  async create(req: RequestType<any, CreatePostDto>, res: Response) {
    const post = await this.service.create(req.body, null);
    if (post === false) {
      return res.status(404).send();
    }
    res.status(201).send(post);
  }

  async getPost(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    const post = await this.service.getOne(req.params.id);
    if (!post) {
      return res.status(404).send("Not Found");
    }
    res.status(200).send(post);
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
}
