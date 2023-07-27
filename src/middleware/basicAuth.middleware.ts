import {NextFunction, Request, Response} from "express";

const validUsername = 'admin';
const validPassword = 'qwerty';
export const BasicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Basic ')) {
    try{
      const credentials = atob(authHeader.slice(6));
      const [username, password] = credentials.split(':');

      if (username === validUsername && password === validPassword) {
        return next();
      }else {
        res.status(401).send('Invalid Token');
      }
    } catch{
      res.status(401).send('Invalid Token');
    }

  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
  res.status(401).send('Authentication Required');
}
