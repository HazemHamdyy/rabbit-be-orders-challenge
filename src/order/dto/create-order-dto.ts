import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderDTO {
  @ApiProperty({
    description: `Any random customer id`,
    required: true,
    example: 1,
  })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: `area id of that your order will be addressed at e.g.(1 ,2 ,3 ,4)`,
    required: true,
    example: 1,
  })
  @IsNumber()
  areaId: number;
}
