import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllProductsDTO {
  @ApiProperty({
    description: `Part of name of the product you want to search`,
    required: false,
    example: 'Product 1', // Get all products contain 'Product 1'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: `List of category ids you want to filter products based on them`,
    required: false,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    value
      .split(',')
      .map((id: string) => Number(id))
      .filter((id: number) => !isNaN(id)),
  )
  categoryIds?: number[];

  // Paginationto Reduces load times by limiting the amount of data loaded at once, which is especially beneficial for large datasets.
  @ApiProperty({
    description: `Page number you want to search at and the minimum value 1 NOTE: "BY DEFAULT IT IS 1"`,
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: `number of products you want to take in each page and the minimum value 1 and maximum value 100 NOTE: "BY DEFAULT IT IS 20"`,
    required: false,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  take: number = 20;
}
