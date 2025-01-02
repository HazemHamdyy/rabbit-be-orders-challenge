import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(orderData: CreateOrderDTO) {
    const order = await this.prismaService.order.create({
      data: orderData,
      include: { area: true },
    });

    // SEND NOTIFICATION USING PUSHHOVER
    await this.notificationService.sendNotification(
      'New Order 😎',
      `New order with id: ${order.id}, has been created from ${order.customerId} user in ${order.area.name} region at ${order.createdAt}`,
    );

    return order;
  }
}
