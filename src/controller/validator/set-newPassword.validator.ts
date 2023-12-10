import { body } from "express-validator";

export const SetNewPasswordValidator = [
  body("newPassword").trim().isLength({ min: 6, max: 20 }),
];
