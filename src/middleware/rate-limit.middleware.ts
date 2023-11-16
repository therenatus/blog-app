import { NextFunction, Request, Response } from "express";
import { ipCollection } from "../index";
import { IpInterface } from "../types/ip.interface";

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
  await ipCollection.insertOne(data);
  const ips = await ipCollection
    .find({ date: { $gt: tenSecondsAgo }, URL: url, IP: ip })
    .toArray();
  if (ips.length > 5) {
    return res.status(429).send();
  }
  next();
};
