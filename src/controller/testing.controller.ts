import { TestingService } from "../service/testing.service";
import { Request, Response } from "express";
import { StatusEnum } from "../types/status.enum";
import { injectable } from "inversify";

@injectable()
export class TestingController {
  constructor(protected service: TestingService) {}

  async deleteAll(req: Request, res: Response) {
    const deleted = await this.service.deleteAllData();
    if (deleted) {
      return res.sendStatus(StatusEnum.NOT_CONTENT);
    }
  }
}
