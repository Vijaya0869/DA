import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateFinancingDto {
  @ApiProperty()
  @IsInt()
  interest_rate: number | null;

  @ApiProperty()
  @IsUUID()
  financing_of_type_id: string | null;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  property_id: string | null;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  down_payment: number | null;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number | null;

  @ApiProperty()
  amount_type: string | null;

  @ApiProperty()
  down_payment_type: string | null;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  rehab_down_payment: number | null;

  @ApiProperty()
  @IsUUID()
  loan_type_id: string | null;

  @ApiProperty()
  @IsNotEmpty()
  loan_label: string | null;

  @IsInt()
  @ApiProperty()
  loan_term: number | null;
}
