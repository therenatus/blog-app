import { ISession } from "../types/session.interface";
import { WithId } from "mongodb";
import { SessionModel } from "../model/session.model";

export class SessionRepository {
  async login(data: ISession): Promise<ISession | null> {
    return SessionModel.create(data);
  }

  async getSessionById(ip: string): Promise<boolean> {
    const session = await SessionModel.findOne({ ip });
    return !session;
  }

  async getAll(userId: string): Promise<WithId<ISession>[]> {
    return await SessionModel.find({ userId }, { _id: 0, userId: 0 }).exec();
  }

  async deleteOne(deviceId: string): Promise<boolean> {
    const { deletedCount } = await SessionModel.deleteOne({ deviceId });
    return deletedCount !== 0;
  }

  async deleteAll(data: any): Promise<boolean> {
    const { deletedCount } = await SessionModel.deleteMany({
      userId: data.id,
      deviceId: { $ne: data.deviceId },
    });
    return deletedCount !== 0;
  }

  async findOne(deviceId: string): Promise<ISession | null> {
    return SessionModel.findOne({ deviceId });
  }

  async updateByIP(deviceId: string, ip: string, userAgent: string) {
    return SessionModel.findOneAndUpdate(
      { ip },
      { $set: { deviceId, lastActiveDate: new Date(), title: userAgent } },
    );
  }

  async updateLastActive(deviceId: string): Promise<void> {
    await SessionModel.updateOne(
      { deviceId },
      { $set: { lastActiveDate: new Date() } },
    );
  }
}
