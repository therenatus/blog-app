import { NextFunction, Request, Response } from "express";
import { IpInterface } from "../types/ip.interface";
import { IpModel } from "../model/ip.model";

export const RateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
  const url = req.originalUrl;
  const ip = req.ip;

  const data: IpInterface = {
    IP: ip,
    URL: url,
    date: new Date(),
  };
  await IpModel.create(data);
  const ips = await IpModel.find({
    date: { $gt: tenSecondsAgo },
    URL: url,
    IP: ip,
  }).exec();
  if (ips.length > 5) {
    return res.status(429).send();
  }
  next();
};
