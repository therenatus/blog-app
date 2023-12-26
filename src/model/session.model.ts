import mongoose from "mongoose";
import { SessionType } from "../types/session.type";

export const SessionSchema = new mongoose.Schema<SessionType>({
  ip: { type: String, require },
  title: { type: String, require },
  deviceId: { type: String, require },
  userId: { type: String, require },
  lastActiveDate: { type: Date, require },
});

export const SessionModel = mongoose.model<SessionType>(
  "sessions",
  SessionSchema,
);
