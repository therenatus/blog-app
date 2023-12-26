import { body } from "express-validator";
import { UserModel } from "../../model/user.model";

export const CheckCodeValidator = [
  body("code")
    .trim()
    .isString()
    .custom(async (code) => {
      const user = await UserModel.findOne({
        "emailConfirmation.confirmationCode": code,
      }).exec();
      if (!user) {
        throw new Error("User not found");
      }
      if (user.emailConfirmation.isConfirmed) {
        throw new Error("User is already confirmed");
      }
      if (user.emailConfirmation.expirationDate > new Date()) {
        throw new Error("Link is expired");
      }
      return true;
    }),
];
