import {tokenCollection} from "../index";

export class TokenRepository {
  async addToBlackList(token: string): Promise<boolean> {
    const {acknowledged} = await tokenCollection.insertOne({token});
    return acknowledged;
  }

  async checkFromBlackList(token: string): Promise<boolean> {
    const found = await tokenCollection.findOne({token});
    if(found){
      return false;
    }
    return true;
  }
}