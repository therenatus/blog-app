import nodemailer from 'nodemailer'
import {IRegistration} from "../types/user.types";

export class EmailAdapter {
  async sendMail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zonex1501@gmail.com',
        pass: 'lliijhnschxrygsi'
      }
    })

    const info = await transporter.sendMail({
      from: 'Rinad <zonex1501@gmail.com>',
      to: email,
      subject: subject,
      html: message
    });
    return info;
  }
}