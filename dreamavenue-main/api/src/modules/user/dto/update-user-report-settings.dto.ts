import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserReportSettingsDto {
  @ApiProperty()
  @IsNotEmpty()
  report_name: string;

  @ApiPropertyOptional()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  section_name: string;

  @ApiProperty()
  @IsNotEmpty()
  selected: boolean;
}
