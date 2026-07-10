import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { JwtModule } from '@nestjs/jwt';
import { Document } from './entities/document.entity';
import { PurchaseCosts } from './entities/purchase-costs.entity';
import { HoldingCosts } from './entities/holding-costs.entity';
import { RehabCosts } from './entities/rehab-costs.entity';
import { SellingCosts } from './entities/selling-costs.entity';
import { Image } from './entities/image.entity';
import { ClosingCosts } from './entities/closing-costs.entity';
import { HttpModule } from '@nestjs/axios';
import { MasterService } from '../master/master.service';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { QueueService } from '../queue/queue.service';
import { PropertyQueueProcessor } from '../queue/queue.processor';
import { Financing } from './entities/financing.entity';
import { RentcastService } from '../analysis/rentcast.service';
import { DatafinitiService } from '../analysis/datafiniti.service';
import { PropQuery } from '../analysis/entities/prop_query.entity';
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
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    TypeOrmModule.forFeature([
      Property,
      Document,
      PurchaseCosts,
      HoldingCosts,
      SellingCosts,
      RehabCosts,
      ClosingCosts,
      Image,
      Financing,
      PropQuery,
    ]),
    HttpModule,
  ],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    MasterService,
    QueueService,
    PropertyQueueProcessor,
    RentcastService,
    DatafinitiService,
    UtilService,
  ],
  exports: [PropertyService],
})
export class PropertyModule {}
