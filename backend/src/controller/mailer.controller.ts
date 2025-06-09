import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '../services/mailer.service';

@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail(
    @Body()
    body: {
      to: string;
      subject: string;
      html: string;
      attachments: { filename: string; path: string }[];
    },
  ) {
    const { to, subject, html, attachments } = body;

    if (
      !attachments ||
      !Array.isArray(attachments) ||
      attachments.length === 0
    ) {
      throw new InternalServerErrorException('No attachments provided');
    }

    return this.mailerService.sendMailWithAttachments(
      to,
      subject,
      html,
      attachments,
    );
  }
}
