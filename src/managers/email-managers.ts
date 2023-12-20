import { EmailAdapter } from "../adapter/email-adapter";
import { UserDBType } from "../types/user.types";
import { injectable } from "inversify";

@injectable()
export class EmailManagers {
  constructor(protected emailAdapter: EmailAdapter) {}
  async sendPasswordRecoveryMessages(user: UserDBType) {
    await this.emailAdapter.sendMail(
      user.accountData.email,
      "Reset password",
      recoveryPassword(user.emailConfirmation.confirmationCode),
    );
  }

  async sendConfirmMessages(user: UserDBType) {
    await this.emailAdapter.sendMail(
      user.accountData.email,
      "Please, confirm email",
      confirmMessage(user.emailConfirmation.confirmationCode),
    );
  }
}

const confirmMessage = (code: string) =>
  `<h1>Thanks for your registration</h1><p>To finish registration please follow the link below: <a href="https://somesite.com/confirm-email?code=${code}">complete registration</a></p>`;
const recoveryPassword = (code: string) => `
  <h1>Password recovery</h1>
  <p>To finish password recovery, please follow the link below:
    <a href="https://somesite.com/password-recovery?recoveryCode=${code}">Recovery Password</a>
  </p>
`;
