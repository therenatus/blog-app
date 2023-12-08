export interface IUser {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  hashPassword: string;
}

export interface ILogin {
  loginOrEmail: string;
  password: string;
}

type emailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export interface IRegistration {
  login: string;
  password: string;
  email: string;
}

export type UserDBType = {
  accountData: IUser;
  emailConfirmation: emailConfirmation;
};
