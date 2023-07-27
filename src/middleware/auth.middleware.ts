import {NextFunction, Request, Response} from "express";
import {JwtService} from "../helpers/jwtService";

const jwtService = new JwtService()

export const AuthMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if(!auth){
    res.status(401).send("forbiden 2");
    return ;
  }
  const token = auth.split(' ')[1];
  if(!token){
    return res.status(401).send("Forbidden");
  }
  const userId = await jwtService.getUserByToken(token);
  if(!userId){
    return res.status(401).send("Forbidden");
  }
  req.userId = userId.id;
  next()
}