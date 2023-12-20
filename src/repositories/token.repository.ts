import { TokenModel } from "../model/token.model";
import { injectable } from "inversify";

@injectable()
export class TokenRepository {
  async addToBlackList(token: string) {
    await TokenModel.create({ token });
  }

  async checkFromBlackList(token: string): Promise<boolean> {
    const found = await TokenModel.findOne({ token });
    return !found;
  }
}
