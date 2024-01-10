import { Injectable } from '@nestjs/common';
import { EmailAdapter } from './email.adapter';
import { User } from '../users/schema/user.schema';

@Injectable()
export class EmailService {
  constructor(private readonly emailAdapter: EmailAdapter) {}

  async sendConfirmMessage(user: User) {
    await this.emailAdapter.sendEmail(
      user.email,
      'Please, confirm email',
      '454545',
    );
  }
}
