import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCostsDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  property_id: string;

  @ApiProperty()
  @IsNotEmpty()
  amount_type: string;

  @ApiProperty()
  @IsOptional()
  period_type: string;

  @ApiProperty()
  @IsOptional()
  no_of_periods: number;

  @ApiProperty()
  @IsNotEmpty()
  purchase_price: number;

  calculated_amount: number;
}
