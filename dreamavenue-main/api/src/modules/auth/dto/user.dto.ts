import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UserViewModelDto {
  @ApiProperty({
    description: 'The first name of the user',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}