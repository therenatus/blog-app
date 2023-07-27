import {ObjectId} from "mongodb";


declare global {
  declare namespace Express {
    export interface Request {
      userId: string | null;
    }
  }
}