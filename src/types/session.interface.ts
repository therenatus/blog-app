export interface ISession {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
  userId: string;
}

export interface SessionResponseType extends ISession {
  _id: string;
}
