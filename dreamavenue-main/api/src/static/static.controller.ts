import { Controller, Get, Query } from '@nestjs/common';
import { StaticService } from './static.service';

@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('property-columns-for-import')
  async getPropertyColumnsForImport() {
    return this.staticService.getPropertyColumnsForImport();
  }
}
