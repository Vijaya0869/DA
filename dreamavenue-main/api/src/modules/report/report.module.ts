import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { JwtModule } from '@nestjs/jwt';
import { PropertyModule } from '../property/property.module';
import { PropertyService } from '../property/property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../property/entities/property.entity';
import { Document } from '../property/entities/document.entity';
import { PurchaseCosts } from '../property/entities/purchase-costs.entity';
import { HoldingCosts } from '../property/entities/holding-costs.entity';
import { SellingCosts } from '../property/entities/selling-costs.entity';
import { RehabCosts } from '../property/entities/rehab-costs.entity';
import { ClosingCosts } from '../property/entities/closing-costs.entity';
import { Image } from '../property/entities/image.entity';
import { Financing } from '../property/entities/financing.entity';
import { PropQuery } from '../analysis/entities/prop_query.entity';
import { HttpModule } from '@nestjs/axios';
import { MasterService } from '../master/master.service';
import { MasterModule } from '../master/master.module';
import { RentcastService } from '../analysis/rentcast.service';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { UtilService } from '../common/util-service';
import { AnalysisModule } from '../analysis/analysis.module';
import { DatafinitiService } from '../analysis/datafiniti.service';

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
    PropertyModule,
    MasterModule,
    AnalysisModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    PropertyService,
    MasterService,
    RentcastService,
    UtilService,
    DatafinitiService,
  ],
})
export class ReportModule {}
