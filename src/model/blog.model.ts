import * as mongoose from "mongoose";
import { IBlog } from "../types/blog.interface";

export const BlogSchema = new mongoose.Schema<IBlog>({
  id: { type: String, require },
  name: { type: String, require },
  description: { type: String, require },
  websiteUrl: { type: String, require },
  createdAt: { type: Date, require },
  isMembership: { type: Boolean, require },
});

export const BlogModel = mongoose.model<IBlog>("blogs", BlogSchema);
