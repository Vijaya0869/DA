import { BullModuleOptions } from '@nestjs/bull';

export const getBullConfig = (queueName: string): BullModuleOptions => ({
  name: queueName,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
  },
});
