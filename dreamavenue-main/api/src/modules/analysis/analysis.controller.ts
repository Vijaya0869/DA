import { Controller, Get, Query } from '@nestjs/common';
import { RentcastService } from './rentcast.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly rentcastService: RentcastService) {}

  @Get('rental-comps')
  async getRentalComps(@Query('propertyId') propertyId: string) {
    return this.rentcastService.getRentalComps(propertyId);
  }

  @Get('property-data')
  async getPropertyData(@Query('propertyId') propertyId: string) {
    return this.rentcastService.getPropertyData(propertyId);
  }
}
