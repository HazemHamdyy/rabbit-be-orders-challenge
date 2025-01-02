import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Create your order',
    description: `Create order by passing customerId and areaId and notify the admin by adding his credintials`,
  })
  @ApiResponse({
    status: 201,
    description: 'order created successfully',
  })
  @Post()
  //CREATE ORDER WITH SENDING NOTIFICATION
  async create(@Body() data: CreateOrderDTO) {
    return this.orderService.create(data);
  }
}
