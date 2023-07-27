import {ObjectId} from "mongodb";

export interface IUser {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  hashPassword: string;
}

type emailConfirmation = {
  confirmationCode: string,
  expirationDate: Date,
  isConfirmed: boolean
}

export interface IRegistration {
  login: string;
  password: string;
  email: string;
}

export type UserDBType = {
  _id: ObjectId,
  accountData: IUser,
  emailConfirmation: emailConfirmation
}
