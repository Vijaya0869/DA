import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetUserReportSettings {
  @ApiProperty()
  @IsNotEmpty()
  report_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  user_id: string | null;
}
