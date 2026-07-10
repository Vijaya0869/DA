import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  zip_code: string;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  bedrooms: number | null;

  @ApiProperty()
  @IsOptional()
  parking: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  bathrooms: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  year_built: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  listing_price: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  estimated_arv: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  estimated_rent: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  square_feet: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  lot_size: number | null;

  @ApiProperty()
  @IsOptional()
  property_type_id: string;

  @ApiProperty()
  @IsNotEmpty()
  investment_strategy_id: string;

  @ApiProperty()
  @IsOptional()
  lot_size_type: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  purchase_price: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  closing_costs: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  rehab_cost_overrun: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  rehab_cost_holding_period: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  purchase_costs: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  after_repair_value: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  rehab_costs: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  selling_costs: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  holding_costs: number | null;

  @ApiProperty()
  @IsOptional()
  notes: string | null;

  @ApiProperty()
  @IsOptional()
  tags_n_labels: string | null;

  @ApiProperty()
  @IsOptional()
  zoning: string | null;

  @ApiProperty()
  @IsOptional()
  mls_number: string | null;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_favorite: boolean | false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  clear_rehab_itemize_costs: boolean | false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  clear_purchase_itemize_costs: boolean | false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  clear_holding_itemize_costs: boolean | false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  clear_closing_itemize_costs: boolean | false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  clear_selling_itemize_costs: boolean | false;

  @ApiProperty()
  @IsOptional()
  closing_costs_type: string | null;

  @ApiProperty()
  @IsOptional()
  rehab_costs_type: string | null;

  @ApiProperty()
  @IsOptional()
  selling_costs_type: string | null;

  @ApiProperty()
  @IsOptional()
  purchase_costs_type: string | null;

  @ApiProperty()
  @IsOptional()
  holding_costs_type: string | null;

  userId: string;
}
