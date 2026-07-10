import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { UtilService } from '../common/util-service';

@Module({
  imports: [
    CacheModule.register({
      store: new Keyv({
        store: new KeyvRedis(
          `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`,
        ), // Use correct Redis URL
      }),
      ttl: 60, // Cache expiry in seconds
    }),
  ],
  controllers: [MasterController],
  providers: [MasterService, UtilService],
})
export class MasterModule {}
