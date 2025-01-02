import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetTopProductsDto {
  @ApiProperty({
    description: `Name of area you want the top products at e.g.('maadi', 'new_cairo', 'zayed', 'giza')`,
    required: false,
    example: 'maadi',
  })
  @IsOptional()
  @IsString()
  areaName?: string;

  @ApiProperty({
    description: `latitude of point inside one of our areas`,
    required: false,
    example: 29.947,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lat?: number;

  @ApiProperty({
    description: `Longitude of point inside one of our areas`,
    required: false,
    example: 31.217,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lng?: number;
}
