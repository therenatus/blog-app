import mongoose from "mongoose";
import { UserDBType } from "../types/user.types";

export const UserSchema = new mongoose.Schema<UserDBType>({
  accountData: {
    id: { type: String, require },
    login: { type: String, require },
    email: { type: String, require },
    createdAt: { type: Date, require },
    hashPassword: { type: String, require },
  },
  emailConfirmation: {
    confirmationCode: { type: String, require },
    expirationDate: { type: Date, require },
    isConfirmed: { type: Boolean, require },
  },
});

export const UserModel = mongoose.model<UserDBType>("users", UserSchema);
