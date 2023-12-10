import { body } from "express-validator";
export const RecoveryPasswordValidator = [
  body("email")
    .trim()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Invalid email format"),
];
