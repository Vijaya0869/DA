import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RentcastService } from './rentcast.service';
import { AnalysisController } from './analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropQuery } from './entities/prop_query.entity';
import { Property } from '../property/entities/property.entity';
import { DatafinitiService } from './datafiniti.service';
import { MasterService } from '../master/master.service';
import { UtilService } from '../common/util-service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([PropQuery, Property])],
  providers: [RentcastService, DatafinitiService, UtilService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
