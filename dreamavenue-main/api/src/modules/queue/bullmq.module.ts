import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env variables
    BullModule.registerQueueAsync({
      name: 'property-queue', // Queue name
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          username: configService.get<string>('REDIS_USER', 'default'), // Optional
          password: configService.get<string>('REDIS_PASSWORD'), // Set if Redis requires authentication
          db: configService.get<number>('REDIS_DB', 0), // Redis database index (default 0)
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class BullMqModule {}
