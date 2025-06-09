// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bullmq';

// @Injectable()
// export class TasksService {
//   private readonly logger = new Logger(TasksService.name);

//   constructor(@InjectQueue('mail') private mailQueue: Queue) {}

//   @Cron(CronExpression.EVERY_10_SECONDS)
//   async handleCron() {
//     this.logger.log('Cron job triggered in every 10 seconds');

//     await this.mailQueue.add('sendEmail', {
//       to: 'vasanth12ait@gmail.com.',
//       subject: 'Scheduled Email',
//       body: 'This is a test email triggered by Cron.',
//     });

//     this.logger.log('Job added to mail queue');
//   }
// }
