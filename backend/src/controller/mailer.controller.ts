import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';

@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail(@Body() body: any) {
    const { to, subject, html, attachments } = body;
    return this.mailerService.sendMailWithAttachments(to, subject, html, attachments || []);
  }
}
