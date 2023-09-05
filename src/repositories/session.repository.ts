import {ISession} from "../types/session.interface";
import {sessionCollection} from "../index";
import {ObjectId} from "mongodb";

export class SessionRepository {
  async login(data: ISession): Promise<ObjectId>{
    const { insertedId } = await sessionCollection.insertOne(data);
    return insertedId;
  }

  async getAll(): Promise<ISession[]>{
    return await sessionCollection.find().toArray();
  }

  async deleteOne(deviceId: string): Promise<boolean> {
    const {deletedCount} = await sessionCollection.deleteOne({deviceId});
    return deletedCount !== 0;
  }

  async deleteAll(deviceId: string): Promise<boolean> {
    const {deletedCount} = await sessionCollection.deleteMany({deviceId: { $ne : deviceId}});
    return deletedCount !== 0;
  }

  async updateLastActive(deviceId: string, newDate: Date) {
    const { acknowledged } = await sessionCollection.updateOne({deviceId}, {$set: {lastActiveDate: newDate}});
    return acknowledged;
  }
}