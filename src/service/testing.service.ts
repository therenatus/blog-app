import { Request, Response } from 'express';
import {
  blogCollection,
  commentCollection,
  ipCollection,
  postCollection,
  sessionCollection,
  tokenCollection,
  userCollection,
} from '../index';

export class Test {
  async deleteAll(req: Request, res: Response) {
    try {
      await blogCollection.deleteMany();
      await postCollection.deleteMany();
      await userCollection.deleteMany();
      await sessionCollection.deleteMany();
      await commentCollection.deleteMany();
      await ipCollection.deleteMany();
      await tokenCollection.deleteMany();
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
    }
  }
}
