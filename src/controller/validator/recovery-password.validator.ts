import { body, oneOf } from "express-validator";
import { UserRepository } from "../../repositories/user.repository";

const repository = new UserRepository();
export const RecoveryPasswordValidator = [
  body("email")
    .trim()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Invalid email format"),
  body("email")
    .trim()
    .custom(async (email) => {
      const user = await repository.getOne(email);
      if (!user) {
        throw new Error("email is not exist");
      }
      return true;
    }),
];
