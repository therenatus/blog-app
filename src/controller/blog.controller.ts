import { Response } from "express";
import { BlogService } from "../service/blog.service";
import { IPaginationResponse } from "../types/pagination-response.interface";
import { BlogType } from "../types/blog.type";
import { PostType } from "../types/post.type";
import { PostService } from "../service/post.service";
import { RequestType } from "../types/request.type";
import { URIParamsInterface } from "../types/URIParams.interface";
import { IQuery } from "../types/query.interface";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { StatusEnum } from "../types/status.enum";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { injectable } from "inversify";

@injectable()
export class BlogController {
  constructor(
    protected service: BlogService,
    protected postService: PostService,
  ) {}

  async getBlogs(
    req: RequestType<{}, {}, IQuery>,
    res: Response<IPaginationResponse<BlogType[]>>,
  ) {
    const data = await this.service.getAll(req.query);
    const { items, meta } = data;

    const blogsResponse: IPaginationResponse<BlogType[]> = {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
    return res.status(StatusEnum.SUCCESS).send(blogsResponse);
  }

  async createBlog(
    req: RequestType<{}, CreateBlogDto>,
    res: Response<BlogType>,
  ) {
    const blog = await this.service.create(req.body);
    if (!blog) {
      return res.sendStatus(StatusEnum.NOT_CONTENT);
    }
    return res.status(StatusEnum.CREATED).send(blog);
  }

  async getBlogById(
    req: RequestType<URIParamsInterface>,
    res: Response<BlogType>,
  ) {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const blog = await this.service.getOne(req.params.id);
    if (!blog) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.status(StatusEnum.SUCCESS).send(blog);
  }

  async getBlogPosts(
    req: RequestType<URIParamsInterface, {}, IQuery>,
    res: Response<IPaginationResponse<PostType[]>>,
  ) {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const posts = await this.service.findBlogsPost(req.params.id, req.query);
    if (typeof posts === "boolean") {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const { items, meta } = posts;
    const blogsResponse: IPaginationResponse<PostType[]> = {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
    res.status(StatusEnum.SUCCESS).send(blogsResponse);
  }

  async createPost(
    req: RequestType<{ id: string }, CreatePostDto>,
    res: Response,
  ) {
    const auth = req.headers.authorization;
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const post = await this.postService.create(req.body, req.params.id, auth);
    if (post === false || !post) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.status(StatusEnum.CREATED).send(post);
  }

  async updateBlog(
    req: RequestType<{ id: string }, UpdateBlogDto>,
    res: Response,
  ) {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const post = await this.service.update(req.params.id, req.body);
    if (!post) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.status(StatusEnum.NOT_CONTENT).send(post);
  }

  async deletePost(req: RequestType<{ id: string }>, res: Response) {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const blog = await this.service.delete(req.params.id);
    if (!blog) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.sendStatus(StatusEnum.NOT_CONTENT);
  }
}
