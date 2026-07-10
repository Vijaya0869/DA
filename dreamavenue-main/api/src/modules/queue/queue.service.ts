import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('property-queue') private readonly myQueue: Queue) {}

  async addJob(data: any) {
    console.log('Job added to queue 1:', data);
    await this.myQueue.add('property-job', data, {
      attempts: 3, // Retry 3 times on failure
      delay: 1000, // 1 sec delay
    });
    setTimeout(() => {
      console.log('Job added to queue 10:', data);
    }, 10000);
  }
}
