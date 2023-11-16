import express, { Request, Response } from "express";
import { AuthService } from "../service/auth.service";
import { LoginValidator } from "./validator/login.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { CheckCodeValidator } from "./validator/check-code.validator";
import { FindCheckEmailValidator } from "./validator/find-check-email.validator";
import { CreateUserValidator } from "./validator/create-user.validator";
import { RateLimitMiddleware } from "../middleware/rate-limit.middleware";
import { RequestType } from "../types/request.type";
import { ILogin, IRegistration } from "../types/user.types";
import { StatusEnum } from "../types/status.enum";

const router = express.Router();
const service = new AuthService();

router.post(
  "/login",
  LoginValidator,
  InputValidationMiddleware,
  RateLimitMiddleware,
  async (req: RequestType<any, ILogin>, res: Response) => {
    const data = await service.login(
      req.body,
      req.ip,
      req.headers["user-agent"]!,
    );
    if (!data || typeof data === "boolean") {
      return res
        .status(StatusEnum.UNAUTHORIZED)
        .send("Password or login incorrect");
    }
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(StatusEnum.SUCCESS).send({ accessToken: data.accessToken });
  },
);

router.post("/refresh-token", async (req: Request, res: Response) => {
  if (!req.cookies.refreshToken) {
    return res.sendStatus(StatusEnum.UNAUTHORIZED);
  }
  const data = await service.refreshToken(req.cookies.refreshToken);
  if (!data) {
    return res.sendStatus(StatusEnum.UNAUTHORIZED);
  }
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.status(StatusEnum.SUCCESS).send({ accessToken: data.accessToken });
});

router.post("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  // const accessToken = req.cookies.accessToken;
  if (!refreshToken) {
    return res.sendStatus(StatusEnum.UNAUTHORIZED);
  }
  const data = await service.logout(refreshToken);
  if (!data) {
    return res.sendStatus(StatusEnum.UNAUTHORIZED);
  }
  res.clearCookie("refreshToken");
  res.sendStatus(StatusEnum.NOT_CONTENT);
});

router.get("/me", AuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.sendStatus(StatusEnum.UNAUTHORIZED);
  }
  const user = await service.getMe(userId);
  if (!user || typeof user === "boolean") {
    return res.sendStatus(StatusEnum.UNAUTHORIZED);
  }
  const userResponse = {
    userId: user.id,
    email: user.email,
    login: user.login,
  };
  res.status(StatusEnum.SUCCESS).send(userResponse);
});

router.post(
  "/registration",
  CreateUserValidator,
  InputValidationMiddleware,
  RateLimitMiddleware,
  async (req: RequestType<any, IRegistration>, res: Response) => {
    await service.registration(req.body);
    return res.sendStatus(StatusEnum.NOT_CONTENT);
  },
);

router.post(
  "/registration-confirmation",
  RateLimitMiddleware,
  CheckCodeValidator,
  InputValidationMiddleware,
  async (req: RequestType<any, { code: string }>, res: Response) => {
    const isConfirm = service.confirmUser(req.body.code);
    if (!isConfirm) {
      return res.sendStatus(StatusEnum.BAD_REQUEST);
    }
    return res.sendStatus(StatusEnum.NOT_CONTENT);
  },
);

router.post(
  "/registration-email-resending",
  FindCheckEmailValidator,
  InputValidationMiddleware,
  RateLimitMiddleware,
  async (req: RequestType<any, { email: string }>, res: Response) => {
    const isConfirm = service.resendEmail(req.body.email);
    if (!isConfirm) {
      return res.sendStatus(StatusEnum.BAD_REQUEST);
    }
    res.sendStatus(StatusEnum.NOT_CONTENT);
  },
);
export default router;
