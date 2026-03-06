import { Controller, Body, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  create(@Body() dto: OrderDto) {
    return this.ordersService.createOrder(dto);
  }
}
