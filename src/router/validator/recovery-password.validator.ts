import { body } from "express-validator";

export const RecoveryPasswordValidator = [
  body("email")
    .trim()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Invalid email format"),
];
