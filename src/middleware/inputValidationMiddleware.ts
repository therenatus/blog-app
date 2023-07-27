import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

const validationErrorFormatter = ({ msg, path }: any) => {
  return {
    message: msg,
    field: path,
  };
};
export const InputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(validationErrorFormatter);
  if(!errors.isEmpty()) {
    res.status(400).send({errorsMessages: errors.array({ onlyFirstError: true })})
  } else {
    next();
  }
}