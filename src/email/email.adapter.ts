import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as process from 'process';

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, subject: string, message: string) {
    if (
      !process.env.MAIL_HOST ||
      !process.env.MAIL_PORT ||
      !process.env.MAIL_LOGIN ||
      !process.env.MAIL_PASS
    ) {
      throw new Error(
        'Missing required environment variables for mail configuration.',
      );
    }
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASS,
      },
    });

    return await transporter.sendMail({
      from: 'Rinad <zonex1501@gmail.com>',
      to: email,
      subject: subject,
      html: message,
    });
  }
}
