import express, {NextFunction, Request, Response} from "express";
import { PostService } from '../service/post.service';
import {createPostValidator} from "./validator/create-post.validator";
import {InputValidationMiddleware} from "../middleware/inputValidationMiddleware";
import {BasicAuthMiddleware} from "../middleware/basicAuth.middleware";
import {IPaginationResponse} from "../types/pagination-response.interface";
import {IPost} from "../types/post.interface";
import {AuthMiddleware} from "../middleware/auth.middleware";
import {CommentService} from "../service/comment.service";
import {CommentQueryRepository} from "../repositories/query/comment-query.repository";
import {CreateCommentValidator} from "./validator/create-comment.validator";

const router = express.Router();
const service = new PostService();
const commentService = new  CommentService()

router.put('*', BasicAuthMiddleware);
router.get('/', async(req: Request, res: Response) => {
  const posts = await service.getAll(req.query);
  const {items, meta} = posts;
  const blogsResponse: IPaginationResponse<IPost[]>= {
    pageSize: meta.pageSize,
    page: meta.pageNumber,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: items
  }
  return res.status(200).send(blogsResponse);
});

router.post('/', BasicAuthMiddleware, createPostValidator, InputValidationMiddleware, async(req: Request, res: Response) => {
  const post = await service.create(req.body, null);
  if(post === false) {
    return res.status(404).send()
  }
  res.status(201).send(post);
});

router.get('/:id', async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const post = await service.getOne(req.params.id);
  if(!post) {
    return res.status(404).send('Not Found');
  }
  res.status(200).send(post);
});

router.put('/:id',createPostValidator, InputValidationMiddleware, async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const post = await service.update(req.params.id, req.body);
  if(!post){
    return res.status(404).send();
  }
  res.status(204).send(post);
});

router.delete('/:id',BasicAuthMiddleware, async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const deleted = await service.delete(req.params.id);
  if(!deleted) {
    return res.status(404).send();
  }
  res.status(204).send();
});

router.post('/:id/comments', AuthMiddleware, CreateCommentValidator, InputValidationMiddleware, async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  if(!req.userId){
    return res.status(401).send();
  }
  const comment = await commentService.createComment(req.params.id, req.body, req.userId);
  if(!comment){
    return res.status(404).send()
  }
  res.status(201).send(comment);
});

router.get('/:id/comments', async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }

  const comment = await CommentQueryRepository({  query: req.query, postId: req.params.id});
  if(!comment) {
    return res.status(404).send()
  }
  res.status(200).send(comment)

})
export default router;