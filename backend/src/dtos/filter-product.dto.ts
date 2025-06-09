import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  stock?: string;
}
