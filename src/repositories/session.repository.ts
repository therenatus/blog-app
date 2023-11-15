import { ISession, SessionResponseType } from "../types/session.interface";
import { sessionCollection } from "../index";
import { ObjectId, WithId } from "mongodb";
import { da } from "date-fns/locale";

export class SessionRepository {
  async login(data: ISession): Promise<ObjectId> {
    const { insertedId } = await sessionCollection.insertOne(data);
    return insertedId;
  }

  async getAll(): Promise<WithId<ISession>[]> {
    return await sessionCollection.find().toArray();
  }

  async deleteOne(deviceId: string): Promise<boolean> {
    const { deletedCount } = await sessionCollection.deleteOne({ deviceId });
    return deletedCount !== 0;
  }

  async deleteAll(data: any): Promise<boolean> {
    console.log(data);
    const { deletedCount } = await sessionCollection.deleteMany({
      userId: data.id,
      deviceId: { $ne: data.deviceId },
    });
    return deletedCount !== 0;
  }

  async findOne(data: any): Promise<ISession | null> {
    return await sessionCollection.findOne(data);
  }

  async updateLastActive(deviceId: string, newDate: Date) {
    const { acknowledged } = await sessionCollection.updateOne(
      { deviceId },
      { $set: { lastActiveDate: newDate } },
    );
    return acknowledged;
  }
}
