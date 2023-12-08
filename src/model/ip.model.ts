import mongoose from "mongoose";
import { IpInterface } from "../types/ip.interface";

export const IpSchema = new mongoose.Schema<IpInterface>({
  IP: { type: String, require },
  URL: { type: String, require },
  date: { type: Date, require },
});

export const IpModel = mongoose.model<IpInterface>("ip", IpSchema);
