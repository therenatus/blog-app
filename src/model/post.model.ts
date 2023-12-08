import * as mongoose from "mongoose";
import { IPost } from "../types/post.interface";
export const PostSchema = new mongoose.Schema<IPost>({
  id: { type: String, require },
  title: { type: String, require },
  shortDescription: { type: String, require },
  content: { type: String, require },
  blogId: { type: String, require },
  blogName: { type: String, require },
  createdAt: { type: Date, require },
});

export const PostModel = mongoose.model<IPost>("posts", PostSchema);
