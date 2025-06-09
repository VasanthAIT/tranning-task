import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';

@Processor('mail')
export class MailProcessor {
  @Process('sendEmail')
  async handleSendEmail(job: Job) {
    const { to, subject, body } = job.data;
    console.log(` Sending email to ${to}`);
    console.log(` Subject: ${subject}`);
    console.log(` Body: ${body}`);
  }
}
