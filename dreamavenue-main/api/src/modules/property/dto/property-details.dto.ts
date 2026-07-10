import { Property } from '../entities/property.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property.dto';

export class PropertyDetailsDto extends Property {
  @ApiProperty()
  down_payment: number;

  @ApiProperty()
  loan_amount: number;

  @ApiProperty()
  interest_rate: number;

  @ApiProperty()
  loan_term: number;

  @ApiProperty()
  total_cash_needed: number;

  @ApiProperty()
  loan_percentage: number;

  @ApiProperty()
  cap_rate_purchase_price: number; // need net operating income

  @ApiProperty()
  roi: number; // need net operating income

  @ApiProperty()
  one_percent_rule: number; // need rental data

  @ApiProperty()
  cash_on_cash_return: number; // need income logic

  @ApiProperty()
  projected_rental_return: number; // need income logic

  @ApiProperty()
  net_rental_return: number; // need income logic

  @ApiProperty()
  loan_to_cost: number;

  @ApiProperty()
  loan_to_value: number;

  @ApiProperty()
  profit_margin: number; // need income

  @ApiProperty()
  arv_per_square_foot: number;

  @ApiProperty()
  price_per_square_foot: number;

  @ApiProperty()
  rehab_per_square_foot: number;

  @ApiProperty()
  rate_to_value: number;

  @ApiProperty()
  gross_rent_multiplier: number;

  @ApiProperty()
  equity_multiple: number;

  @ApiProperty()
  break_even_ratio: number;

  @ApiProperty()
  debt_coverage_ratio: number;

  @ApiProperty()
  debt_yield: number;

  @ApiProperty()
  pie_data: number;

  @ApiProperty()
  bar_data: number;

  @ApiProperty()
  purchase_rehab_data: number;

  @ApiProperty()
  cash_flow_data: number;

  @ApiProperty()
  financing_type: string;

  @ApiProperty()
  loan_type: string;

  @ApiProperty()
  investment_strategy: string;

  sourceData: any;

  @ApiProperty()
  total_purchase_cost: number;
}
