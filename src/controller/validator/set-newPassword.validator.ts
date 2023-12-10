import { body } from "express-validator";
import { UserRepository } from "../../repositories/user.repository";
import { UserModel } from "../../model/user.model";

const repository = new UserRepository();

export const SetNewPasswordValidator = [
  body("newPassword").trim().isLength({ min: 6, max: 20 }),
  body("recoveryCode")
    .trim()
    .isString()
    .custom(async (recoveryCode) => {
      console.log(recoveryCode);
      const user = await UserModel.findOne({
        "emailConfirmation.confirmationCode": recoveryCode,
      });
      console.log(user);
      if (!user) {
        throw new Error("user not found");
      }
      return true;
    }),
];
