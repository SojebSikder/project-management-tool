import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  constructor(private mailerService: MailerService) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'sendTenantInvitation':
        await this.mailerService.sendMail({
          to: job.data.to,
          from: job.data.from,
          subject: job.data.subject,
          template: job.data.template,
          context: job.data.context,
        });
      case 'sendMemberInvitation':
        await this.mailerService.sendMail({
          to: job.data.to,
          from: job.data.from,
          subject: job.data.subject,
          template: job.data.template,
          context: job.data.context,
        });
      default:
        return;
    }
  }

  // @Process('sendTenantInvitation')
  // async sendTenantInvitation(job: Job<any>) {
  //   await this.mailerService.sendMail({
  //     to: job.data.to,
  //     from: job.data.from,
  //     subject: job.data.subject,
  //     template: job.data.template,
  //     context: job.data.context,
  //   });
  // }

  /**
   * process job
   * @param job
   * @returns
   */
  // @Process('sendMemberInvitation')
  // async sendMemberInvitation(job: Job<any>) {
  //   await this.mailerService.sendMail({
  //     to: job.data.to,
  //     from: job.data.from,
  //     subject: job.data.subject,
  //     template: job.data.template,
  //     context: job.data.context,
  //   });
  // }
}
