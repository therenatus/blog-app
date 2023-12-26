import { HydratedDocument, Model } from "mongoose";

export type UserType = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  hashPassword: string;
};

export type LoginType = {
  loginOrEmail: string;
  password: string;
};

type emailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type RegistrationType = {
  login: string;
  password: string;
  email: string;
};

export type UserDBType = {
  accountData: UserType;
  emailConfirmation: emailConfirmation;
};

export type UserDBMethodsType = {
  canBeConfirmed: (code: string) => boolean;
  confirm: (code: string) => void;
  confirmStatus: () => boolean;
  comparePassword: (password: string) => boolean;
};

export type UserModelType = Model<UserDBType, {}, UserDBMethodsType>;
export type UserModelStaticType = Model<UserDBMethodsType> & {
  makeInstance(
    login: string,
    email: string,
    hashPassword: string,
  ): HydratedDocument<UserDBType, UserDBMethodsType>;
};

export type UserModelFullType = UserModelType & UserModelStaticType;
