import { body } from "express-validator";
import { UserRepository } from "../../repositories/user.repository";

const repository = new UserRepository();

export const SetNewPasswordValidator = [
  body("newPassword").trim().isLength({ min: 6, max: 20 }),
  body("recoveryCode")
    .trim()
    .isString()
    .custom(async (recoveryCode) => {
      const user = await repository.getOneByCode(recoveryCode);
      if (!user) {
        throw new Error("user not found");
      }
      return true;
    }),
];
