import { Request, Response } from "express";
import { CommentService } from "../service/comment.service";
import { StatusEnum } from "../types/status.enum";

export class CommentController {
  constructor(protected service: CommentService) {}

  async updateComment(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    const comment = await this.service.update(
      req.body,
      req.params.id,
      req.userId!,
    );
    if (comment === StatusEnum.NOT_FOUND) {
      return res.status(StatusEnum.NOT_FOUND).send();
    }
    if (comment === StatusEnum.FORBIDDEN) {
      return res.status(StatusEnum.FORBIDDEN).send();
    }
    if (comment === StatusEnum.UNAUTHORIZED) {
      return res.status(StatusEnum.UNAUTHORIZED).send();
    }
    res.status(StatusEnum.NOT_CONTENT).send();
  }

  async getComment(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    const auth = req.headers.authorization;
    const comment = await this.service.getOne(req.params.id, auth);
    if (comment === StatusEnum.NOT_FOUND) {
      return res.status(StatusEnum.NOT_FOUND).send();
    }
    res.status(StatusEnum.SUCCESS).send(comment);
  }

  async deleteComment(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    if (!req.userId) {
      return res.status(403).send();
    }
    const comment = await this.service.deleteOne(req.params.id, req.userId);
    if (comment === StatusEnum.FORBIDDEN) {
      return res.status(StatusEnum.FORBIDDEN).send();
    }
    if (comment === StatusEnum.NOT_FOUND) {
      return res.status(StatusEnum.NOT_FOUND).send();
    }
    if (comment === StatusEnum.UNAUTHORIZED) {
      return res.status(StatusEnum.UNAUTHORIZED).send();
    }
    res.status(StatusEnum.NOT_CONTENT).send();
  }

  async like(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(404).send();
    }
    if (!req.userId) {
      return res.status(403).send();
    }
    const commentId = req.params.id;
    const userId = req.userId;
    const status = req.body.status;
    await this.service.updateLikes(commentId, userId, status);
    res.status(StatusEnum.SUCCESS).send();
  }
}
