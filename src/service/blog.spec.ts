import { Request, Response } from "express";
import {
  blogCollection,
  commentCollection,
  ipCollection,
  postCollection,
  sessionCollection, tokenCollection,
  userCollection
} from "../index";

class Test {
  async deleteAll(req: Request, res: Response) {
    await blogCollection.deleteMany();
    await postCollection.deleteMany();
    await userCollection.deleteMany();
    await sessionCollection.deleteMany();
    await commentCollection.deleteMany();
    await ipCollection.deleteMany();
    await tokenCollection.deleteMany();
    res.status(204).send();

  }
}

export { Test };