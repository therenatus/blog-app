import { Request, Response } from "express";
import { BlogModel } from "../model/blog.model";
import { PostModel } from "../model/post.model";
import { UserModel } from "../model/user.model";
import { SessionModel } from "../model/session.model";
import { CommentModel } from "../model/comment.model";
import { IpModel } from "../model/ip.model";
import { TokenModel } from "../model/token.model";

export class Test {
  async deleteAll(req: Request, res: Response) {
    try {
      await BlogModel.deleteMany();
      await PostModel.deleteMany();
      await UserModel.deleteMany();
      await SessionModel.deleteMany();
      await CommentModel.deleteMany();
      await IpModel.deleteMany();
      await TokenModel.deleteMany();
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
    }
  }
}
