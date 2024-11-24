import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('message-queue')
export class ExampleProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'sendMessage':
        console.log(job.data);
      default:
        return;
    }
  }
  /**
   * process job
   * @param job
   * @returns
   */
  // @Process('sendMessage')
  // handleSendMessage(job: Job<unknown>) {
  //   switch (job.name) {
  //     case 'sendMessage':
  //       console.log(job.data);
  //     default:
  //       return;
  //   }
  // }
}
