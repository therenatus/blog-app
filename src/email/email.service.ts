import { Injectable } from '@nestjs/common';
import { EmailAdapter } from './email.adapter';
import { User } from '../users/schema/user.schema';

@Injectable()
export class EmailService {
  constructor(private readonly emailAdapter: EmailAdapter) {}

  async sendConfirmMessage(email: string, confirmationCode: string) {
    await this.emailAdapter.sendEmail(
      email,
      'Please, confirm email',
      confirmationCode,
    );
  }
}
