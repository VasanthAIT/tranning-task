import { Module } from '@nestjs/common';
import { MailerController } from '../controller/mailer.controller';
import { MailerService } from '../services/mailer.service';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from '../services/mail.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService, MailProcessor],
})
export class MailerModule {}
