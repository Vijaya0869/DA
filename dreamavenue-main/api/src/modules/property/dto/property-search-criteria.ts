import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SearchCriteria } from '../../../core/database/search.criteria';

export class PropertySearchCriteria extends SearchCriteria {
  @ApiPropertyOptional()
  @IsOptional()
  investmentStrategy?: string;
}
