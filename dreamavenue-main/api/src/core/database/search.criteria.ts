import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

// Query strings can't carry nested objects reliably (bracket notation like
// `filters[email]=x` doesn't survive this app's request pipeline), so
// `filters`/`orderBy` are passed as a single JSON-encoded query param instead,
// e.g. `?filters={"lastName":"Johnson"}`. This transform decodes that string;
// it's a no-op when the value already arrives as an object (e.g. constructed
// in code, as PropertyController.findAll does).
const parseJsonQueryParam = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

export class SearchCriteria {
  @ApiProperty()
  @IsInt()
  pageNumber: number = 1;

  @ApiProperty()
  @IsInt()
  pageSize: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  searchKey?: string;

  @ApiPropertyOptional({
    description: 'JSON-encoded object, e.g. {"lastName":"Johnson"}',
  })
  @IsOptional()
  @Transform(parseJsonQueryParam)
  filters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'JSON-encoded object, e.g. {"createdAt":"DESC"}',
  })
  @IsOptional()
  @Transform(parseJsonQueryParam)
  orderBy?: { [key: string]: 'ASC' | 'DESC' };

  @IsOptional()
  relations?: string[];

  @IsOptional()
  select?: string[];
}
