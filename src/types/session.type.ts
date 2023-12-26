export type SessionType = {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
  userId: string;
};

export type SessionResponseType = SessionType & {
  _id: string;
};
