import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  name: string;

  description: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  stock: number;

  images?: string[];
}
