import mongoose from "mongoose";

export const TokenSchema = new mongoose.Schema<{ token: string }>({
  token: { type: String, require },
});

export const TokenModel = mongoose.model<{ token: string }>(
  "tokens",
  TokenSchema,
);
