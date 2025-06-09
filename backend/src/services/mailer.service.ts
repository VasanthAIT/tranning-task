import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    console.log('Loaded email credentials:', { user, pass }); 

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  async sendMailWithAttachments(
    to: string,
    subject: string,
    html: string,
    attachments: { filename: string; path: string }[],
  ) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject,
      html,
      attachments,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result);
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }
}
