import {EmailAdapter} from "../adapter/email-adapter";
import {UserDBType} from "../types/user.types";

const emailAdapter = new EmailAdapter()

export class EmailManagers {
  async sendPasswordRecoveryMessages(user: UserDBType) {
    await emailAdapter.sendMail(user.accountData.email, 'Please, confirm email', 'message')
  }

  async sendConfirmMessages(user: UserDBType) {
    await  emailAdapter.sendMail(user.accountData.email, 'Please, confirm email', confirmMessage(user.emailConfirmation.confirmationCode))
  }
}

const confirmMessage = (code: string) => `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href="https://somesite.com/confirm-email?code=${code}">complete registration</a></p>`