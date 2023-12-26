import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";
import { RequestType } from "../types/request.type";
import { LoginType, RegistrationType } from "../types/user.types";
import { StatusEnum } from "../types/status.enum";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { injectable } from "inversify";

@injectable()
export class AuthController {
  constructor(protected service: AuthService) {}

  async login(req: RequestType<any, LoginType>, res: Response) {
    const data = await this.service.login(
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
  }

  async refreshToken(req: Request, res: Response) {
    if (!req.cookies.refreshToken) {
      return res.sendStatus(StatusEnum.UNAUTHORIZED);
    }
    const data = await this.service.refreshToken(req.cookies.refreshToken);
    if (!data) {
      return res.sendStatus(StatusEnum.UNAUTHORIZED);
    }
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(StatusEnum.SUCCESS).send({ accessToken: data.accessToken });
  }

  async recoveryPassword(
    req: RequestType<{}, { email: string }>,
    res: Response,
  ) {
    await this.service.recoveryPassword(req.body.email);
    return res.sendStatus(StatusEnum.NOT_CONTENT);
  }

  async newPassword(req: RequestType<{}, UpdatePasswordDto>, res: Response) {
    const updated = await this.service.setNewPassword(req.body);
    if (!updated) {
      return res.sendStatus(StatusEnum.BAD_REQUEST);
    }
    return res.sendStatus(StatusEnum.NOT_CONTENT);
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(StatusEnum.UNAUTHORIZED);
    }
    const data = await this.service.logout(refreshToken);
    if (!data) {
      return res.sendStatus(StatusEnum.UNAUTHORIZED);
    }
    res.clearCookie("refreshToken");
    res.sendStatus(StatusEnum.NOT_CONTENT);
  }

  async me(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) {
      return res.sendStatus(StatusEnum.UNAUTHORIZED);
    }
    const user = await this.service.getMe(userId);
    if (!user || typeof user === "boolean") {
      return res.sendStatus(StatusEnum.UNAUTHORIZED);
    }
    const userResponse = {
      userId: user.id,
      email: user.email,
      login: user.login,
    };
    res.status(StatusEnum.SUCCESS).send(userResponse);
  }

  async registration(req: RequestType<any, RegistrationType>, res: Response) {
    await this.service.registration(req.body);
    return res.sendStatus(StatusEnum.NOT_CONTENT);
  }

  async registrationConfirmation(
    req: RequestType<any, { code: string }>,
    res: Response,
  ) {
    const isConfirm = this.service.confirmUser(req.body.code);
    if (!isConfirm) {
      return res.sendStatus(StatusEnum.BAD_REQUEST);
    }
    return res.sendStatus(StatusEnum.NOT_CONTENT);
  }

  async registrationResendingMail(
    req: RequestType<any, { email: string }>,
    res: Response,
  ) {
    const isConfirm = this.service.resendEmail(req.body.email);
    if (!isConfirm) {
      return res.sendStatus(StatusEnum.BAD_REQUEST);
    }
    res.sendStatus(StatusEnum.NOT_CONTENT);
  }
}
