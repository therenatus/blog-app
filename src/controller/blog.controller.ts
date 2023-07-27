import express, { Request, Response } from "express";
import {BlogService} from '../service/blog.service'
import {CreateBlogValidator} from "./validator/create-blog.validator";
import {InputValidationMiddleware} from "../middleware/inputValidationMiddleware";
import {BasicAuthMiddleware} from "../middleware/basicAuth.middleware";
import {IPaginationResponse} from "../types/pagination-response.interface";
import {IBlog} from "../types/blog.interface";
import {IPost} from "../types/post.interface";
import {CreatePostWithParamValidator} from "./validator/create-post-with-param.validator";
import {PostService} from "../service/post.service";
import {RequestType} from "../types/request.type";
import {URIParamsInterface} from "../types/URIParams.interface";
import {IQuery} from "../types/query.interface";
import {ICreateBlogDto} from "./dto/create-blog.dto";
import {DataWithPagination} from "../helpers/data-with-pagination";

const router = express.Router();
const service = new BlogService();
const postService = new PostService();


router.post('*', BasicAuthMiddleware);
router.put('*', BasicAuthMiddleware);
router.get('/',async(req: RequestType<{}, {}, IQuery>, res: Response<IPaginationResponse<IBlog[]>>) => {
  const data = await service.getAll(req.query);
  const {items, meta} = data;

  const blogsResponse: IPaginationResponse<IBlog[]> = {
    pageSize: meta.pageSize,
    page: meta.pageNumber,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: items
  }
  return res.status(200).send(blogsResponse);
});

router.post('/', CreateBlogValidator, InputValidationMiddleware, async(req: RequestType<{}, ICreateBlogDto>, res: Response<IBlog>) => {
  const blog = await service.create(req.body);
  if(!blog) {
    return res.status(404).send();
  }
  return res.status(201).send(blog);
});

router.get('/:id', async(req: RequestType<URIParamsInterface>, res: Response<IBlog>) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const blog = await service.getOne(req.params.id);
  if(!blog) {
    return res.status(404).send();
  }
  res.status(200).send(blog);
});

router.get('/:id/posts', async(req: RequestType<URIParamsInterface, {}, IQuery>, res: Response<IPaginationResponse<IPost[]>>) => {
  if(!req.params.id) {
    return res.status(404).send();
  }
  const posts = await service.findBlogsPost(req.params.id, req.query);
  if(typeof posts === "boolean") {
    return res.status(404).send();
  }
  const {items, meta} = posts;
  const blogsResponse: IPaginationResponse<IPost[]> = {
    pageSize: meta.pageSize,
    page: meta.pageNumber,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: items
  }
  res.status(200).send(blogsResponse);
})

router.post('/:id/posts', CreatePostWithParamValidator, InputValidationMiddleware, async(req: Request, res: Response  ) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const post = await postService.create(req.body, req.params.id);
  if(post === false || !post) {
    return res.status(404).send()
  }
  res.status(201).send(post);
})

router.put('/:id',CreateBlogValidator, InputValidationMiddleware, async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const post = await service.update(req.params.id, req.body);
  if(!post) {
    return res.status(404).send();
  }
  res.status(204).send(post);
});

router.delete('/:id',BasicAuthMiddleware, async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const blog = await service.delete(req.params.id);
  if(!blog) {
    return res.status(404).send();
  }
  res.status(204).send();
});

export default router;