import express, {Request, Response} from 'express';
import {AuthMiddleware} from "../middleware/auth.middleware";
import {CommentService} from "../service/comment.service";
import {StatusEnum} from "../types/status.enum";
import {CreateCommentValidator} from "./validator/create-comment.validator";
import {InputValidationMiddleware} from "../middleware/inputValidationMiddleware";

const router = express.Router();
const service = new CommentService();

router.put('/:id', AuthMiddleware, CreateCommentValidator, InputValidationMiddleware, async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const comment = await service.update(req.body, req.params.id, req.userId!);
  if(comment === StatusEnum.NOT_FOUND ){
    return res.status(StatusEnum.NOT_FOUND).send();
  }
  if(comment === StatusEnum.FORBIDDEN ){
    return res.status(StatusEnum.FORBIDDEN).send();
  }
  if(comment === StatusEnum.UNAUTHORIZED ){
    return res.status(StatusEnum.UNAUTHORIZED).send();
  }
  res.status(StatusEnum.NOT_CONTENT).send();
})

router.get('/:id', async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  const comment = await service.getOne(req.params.id);
  if(comment === StatusEnum.NOT_FOUND ){
    return res.status(StatusEnum.NOT_FOUND).send();
  }
  res.status(StatusEnum.SUCCESS).send(comment);
});

router.delete('/:id', AuthMiddleware, async(req: Request, res: Response) => {
  if(!req.params.id){
    return res.status(404).send();
  }
  if(!req.userId){
    return res.status(403).send();
  }
  const comment = await service.deleteOne(req.params.id, req.userId);
  if(comment === StatusEnum.FORBIDDEN){
    return res.status(StatusEnum.FORBIDDEN).send();
  }
  if(comment === StatusEnum.NOT_FOUND ){
    return res.status(StatusEnum.NOT_FOUND).send();
  }
  if(comment === StatusEnum.UNAUTHORIZED ){
    return res.status(StatusEnum.UNAUTHORIZED).send();
  }
  res.status(StatusEnum.NOT_CONTENT).send();
})

export default router;