import mongoose from "mongoose";
import {
  UserDBMethodsType,
  UserDBType,
  UserModelFullType,
} from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { compare } from "bcrypt";

export const UserSchema = new mongoose.Schema<
  UserDBType,
  UserModelFullType,
  UserDBMethodsType
>({
  accountData: {
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true },
    hashPassword: { type: String, required: true },
  },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
});

UserSchema.method("confirmStatus", function (this: UserDBType): boolean {
  return this.emailConfirmation.isConfirmed;
});

UserSchema.method(
  "canBeConfirmed",
  function (this: UserDBType, code: string): boolean {
    const isCodeValid = this.emailConfirmation.confirmationCode === code;
    const isDateValid = this.emailConfirmation.expirationDate > new Date();

    return isCodeValid && isDateValid;
  },
);

UserSchema.method(
  "confirm",
  async function (this: UserDBType & UserDBMethodsType, code: string) {
    if (this.emailConfirmation.isConfirmed) {
      throw new Error("Email is already confirmed");
    }

    if (!this.canBeConfirmed(code)) {
      throw new Error(
        "Invalid confirmation code or account can't be confirmed",
      );
    }

    this.emailConfirmation.isConfirmed = true;
  },
);

UserSchema.method(
  "comparePassword",
  async function (this: UserDBType, password: string): Promise<boolean> {
    try {
      return await compare(password, this.accountData.hashPassword);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Ошибка при сравнении паролей:", error.message);
        throw new Error("Ошибка при сравнении паролей: " + error.message);
      } else {
        console.error("Неизвестная ошибка при сравнении паролей");
        throw new Error("Неизвестная ошибка при сравнении паролей");
      }
    }
  },
);
UserSchema.static(
  "makeInstance",
  function makeInstance(login: string, email: string, hashPassword: string) {
    return new UserModel({
      accountData: {
        id: (+new Date()).toString(),
        login,
        email,
        hashPassword,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1 }),
        isConfirmed: false,
      },
    });
  },
);
export const UserModel = mongoose.model<UserDBType, UserModelFullType>(
  "users",
  UserSchema,
);
