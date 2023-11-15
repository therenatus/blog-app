import { ISession, SessionResponseType } from "../types/session.interface";
import { sessionCollection } from "../index";
import { ObjectId, WithId } from "mongodb";
import { da } from "date-fns/locale";

export class SessionRepository {
  async login(data: ISession): Promise<ObjectId> {
    const { insertedId } = await sessionCollection.insertOne(data);
    return insertedId;
  }

  async getSessionById(ip: string): Promise<boolean> {
    const session = await sessionCollection.findOne({ ip });
    if (!session) {
      return false;
    }
    return true;
  }

  async getAll(): Promise<WithId<ISession>[]> {
    return await sessionCollection
      .find({}, { projection: { _id: 0, userId: 0 } })
      .toArray();
  }

  async deleteOne(deviceId: string): Promise<boolean> {
    const { deletedCount } = await sessionCollection.deleteOne({ deviceId });
    return deletedCount !== 0;
  }

  async deleteAll(data: any): Promise<boolean> {
    const { deletedCount } = await sessionCollection.deleteMany({
      userId: data.id,
      deviceId: { $ne: data.deviceId },
    });
    return deletedCount !== 0;
  }

  async findOne(data: any): Promise<ISession | null> {
    return await sessionCollection.findOne(data);
  }

  async updateByIP(deviceId: string, ip: string, userAgent: string) {
    const { acknowledged } = await sessionCollection.updateOne(
      { ip },
      { $set: { deviceId, lastActiveDate: new Date(), title: userAgent } },
    );
    return acknowledged;
  }
  async updateLastActive(deviceId: string) {
    const { acknowledged } = await sessionCollection.updateOne(
      { deviceId },
      { $set: { lastActiveDate: new Date() } },
    );
    return acknowledged;
  }
}
