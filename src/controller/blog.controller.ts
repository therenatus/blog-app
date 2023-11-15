import express, { Response } from "express";
import { BlogService } from "../service/blog.service";
import { CreateBlogValidator } from "./validator/create-blog.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { BasicAuthMiddleware } from "../middleware/basicAuth.middleware";
import { IPaginationResponse } from "../types/pagination-response.interface";
import { IBlog } from "../types/blog.interface";
import { IPost } from "../types/post.interface";
import { CreatePostWithParamValidator } from "./validator/create-post-with-param.validator";
import { PostService } from "../service/post.service";
import { RequestType } from "../types/request.type";
import { URIParamsInterface } from "../types/URIParams.interface";
import { IQuery } from "../types/query.interface";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { StatusEnum } from "../types/status.enum";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { CreatePostDto } from "./dto/create-post.dto";

const router = express.Router();
const service = new BlogService();
const postService = new PostService();

router.post("*", BasicAuthMiddleware);
router.put("*", BasicAuthMiddleware);
router.get(
  "/",
  async (
    req: RequestType<{}, {}, IQuery>,
    res: Response<IPaginationResponse<IBlog[]>>,
  ) => {
    const data = await service.getAll(req.query);
    const { items, meta } = data;

    const blogsResponse: IPaginationResponse<IBlog[]> = {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
    return res.status(StatusEnum.SUCCESS).send(blogsResponse);
  },
);

router.post(
  "/",
  CreateBlogValidator,
  InputValidationMiddleware,
  async (req: RequestType<{}, CreateBlogDto>, res: Response<IBlog>) => {
    const blog = await service.create(req.body);
    if (!blog) {
      return res.sendStatus(StatusEnum.NOT_CONTENT);
    }
    return res.status(StatusEnum.CREATED).send(blog);
  },
);

router.get(
  "/:id",
  async (req: RequestType<URIParamsInterface>, res: Response<IBlog>) => {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const blog = await service.getOne(req.params.id);
    if (!blog) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.status(StatusEnum.SUCCESS).send(blog);
  },
);

router.get(
  "/:id/posts",
  async (
    req: RequestType<URIParamsInterface, {}, IQuery>,
    res: Response<IPaginationResponse<IPost[]>>,
  ) => {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const posts = await service.findBlogsPost(req.params.id, req.query);
    if (typeof posts === "boolean") {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const { items, meta } = posts;
    const blogsResponse: IPaginationResponse<IPost[]> = {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
    res.status(StatusEnum.SUCCESS).send(blogsResponse);
  },
);

router.post(
  "/:id/posts",
  CreatePostWithParamValidator,
  InputValidationMiddleware,
  async (req: RequestType<{ id: string }, CreatePostDto>, res: Response) => {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const post = await postService.create(req.body, req.params.id);
    if (post === false || !post) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.status(StatusEnum.CREATED).send(post);
  },
);

router.put(
  "/:id",
  CreateBlogValidator,
  InputValidationMiddleware,
  async (req: RequestType<{ id: string }, UpdateBlogDto>, res: Response) => {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const post = await service.update(req.params.id, req.body);
    if (!post) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.status(StatusEnum.NOT_CONTENT).send(post);
  },
);

router.delete(
  "/:id",
  BasicAuthMiddleware,
  async (req: RequestType<{ id: string }>, res: Response) => {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const blog = await service.delete(req.params.id);
    if (!blog) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.sendStatus(StatusEnum.NOT_CONTENT);
  },
);

export default router;
