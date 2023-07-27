import { Request, Response } from "express";
import {blogCollection, postCollection, userCollection} from "../index";

class Test {
  async deleteAll(req: Request, res: Response) {
    await blogCollection.deleteMany();
    await postCollection.deleteMany();
    await userCollection.deleteMany();
    res.status(204).send();

  }
}

export { Test };