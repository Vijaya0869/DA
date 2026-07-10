import { CreateCostsDto } from './create-costs.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRehabCostsDto extends CreateCostsDto {
  @ApiProperty()
  @IsNotEmpty()
  cost_type: string;
}
