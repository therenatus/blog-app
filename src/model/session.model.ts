import mongoose from "mongoose";
import { ISession } from "../types/session.interface";

export const SessionSchema = new mongoose.Schema<ISession>({
  ip: { type: String, require },
  title: { type: String, require },
  deviceId: { type: String, require },
  userId: { type: String, require },
  lastActiveDate: { type: Date, require },
});

export const SessionModel = mongoose.model<ISession>("sessions", SessionSchema);
