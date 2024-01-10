import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as process from 'process';

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
