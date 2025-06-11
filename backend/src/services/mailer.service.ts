import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vasanth12ait@gmail.com',
        pass: 'usryloijmnbkifhf',
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.log('Transporter error:', error);
      } else {
        console.log('Server is ready to send emails');
      }
    });
  }

  async sendMailWithAttachments(
    to: string,
    subject: string,
    html: string,
    attachments: { filename: string; path: string }[],
  ) {
    try {
      const info = await this.transporter.sendMail({
        from: 'vasanth12ait@gmail.com',
        to,
        subject,
        html,
        attachments,
      });

      console.log('Email sent sucessfully:', info.messageId);
      return {message:" Email sent sucessfully"}
    } catch (error) {
      console.error('Failed to send email:', error.response || error);
      throw new Error('Failed to send email');
    }
  }
}
