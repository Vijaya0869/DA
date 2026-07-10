import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('property-queue')
export class PropertyQueueProcessor extends WorkerHost {
  async process(job: any): Promise<void> {
    console.log(`Processing job ${job.id} with data:`, job.data);
    // Your processing logic here...
  }
}
