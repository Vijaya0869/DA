import { Controller, Get, Query } from '@nestjs/common';
import { MasterService } from './master.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('master')
@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get('property_types')
  @ApiOperation({ summary: 'Get property types' })
  getPropertyTypes() {
    return this.masterService.getAllPropertyTypes();
  }

  @Get('loan_types')
  @ApiOperation({ summary: 'Get loan types' })
  getLoanTypes() {
    return this.masterService.getAllLoanTypes();
  }

  @Get()
  @ApiOperation({ summary: 'Get cities' })
  @ApiQuery({
    name: 'state_id',
    type: String,
    required: true,
    description: 'State ID to fetch cities',
  })
  @ApiResponse({ status: 200, description: 'List of cities' })
  get(@Query('state_id') state_id: string) {
    return this.masterService.getCities(state_id);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get cities' })
  @ApiQuery({
    name: 'state_id',
    type: String,
    required: false,
    description: 'State ID to fetch cities',
  })
  @ApiResponse({ status: 200, description: 'List of cities' })
  getCities(@Query('state_id') state_id: string | undefined) {
    return this.masterService.getCities(state_id);
  }

  @Get('states')
  @ApiOperation({ summary: 'Get states' })
  getStates() {
    return this.masterService.getStates();
  }

  @Get('investment_strategies')
  @ApiOperation({ summary: 'Get investment strategies' })
  getInvestmentStrategies() {
    return this.masterService.getInvestmentStrategies();
  }

  @Get('financing_of_types')
  @ApiOperation({ summary: 'Get Financing of types' })
  getFinancingOfTypes() {
    return this.masterService.getFinancingOfTypes();
  }

  @Get('suggest_address')
  @ApiOperation({ summary: 'Auto suggest address' })
  suggestAddress(@Query('query') query: string) {
    return this.masterService.suggestAddress(query);
  }
}
