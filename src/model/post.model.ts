import * as mongoose from "mongoose";
import { PostType } from "../types/post.type";
export const PostSchema = new mongoose.Schema<PostType>({
  id: { type: String, require },
  title: { type: String, require },
  shortDescription: { type: String, require },
  content: { type: String, require },
  blogId: { type: String, require },
  blogName: { type: String, require },
  createdAt: { type: Date, require },
});

export const PostModel = mongoose.model<PostType>("posts", PostSchema);
