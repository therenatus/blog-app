import { RateLimitMiddleware } from "../middleware/rate-limit.middleware";
import { LoginValidator } from "./validator/login.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { container } from "../composition-root";
import { RecoveryPasswordValidator } from "./validator/recovery-password.validator";
import { SetNewPasswordValidator } from "./validator/set-newPassword.validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { CreateUserValidator } from "./validator/create-user.validator";
import { CheckCodeValidator } from "./validator/check-code.validator";
import { FindCheckEmailValidator } from "./validator/find-check-email.validator";
import express from "express";
import { AuthController } from "../controller/auth.controller";

const router = express.Router();

const authController = container.resolve(AuthController);

router.post(
  "/login",
  RateLimitMiddleware,
  LoginValidator,
  InputValidationMiddleware,
  authController.login.bind(authController),
);

router.post("/refresh-token", authController.refreshToken.bind(authController));

router.post(
  "/password-recovery",
  RateLimitMiddleware,
  RecoveryPasswordValidator,
  InputValidationMiddleware,
  authController.recoveryPassword.bind(authController),
);

router.post(
  "/new-password",
  RateLimitMiddleware,
  SetNewPasswordValidator,
  InputValidationMiddleware,
  authController.newPassword.bind(authController),
);
router.post("/logout", authController.logout.bind(authController));

router.get("/me", AuthMiddleware, authController.me.bind(authController));

router.post(
  "/registration",
  RateLimitMiddleware,
  CreateUserValidator,
  InputValidationMiddleware,
  authController.registration.bind(authController),
);

router.post(
  "/registration-confirmation",
  RateLimitMiddleware,
  CheckCodeValidator,
  InputValidationMiddleware,
  authController.registrationConfirmation.bind(authController),
);

router.post(
  "/registration-email-resending",
  RateLimitMiddleware,
  FindCheckEmailValidator,
  InputValidationMiddleware,
  authController.registrationResendingMail.bind(authController),
);
export default router;
