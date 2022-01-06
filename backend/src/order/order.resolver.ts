import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { UpdateOrderStatusInput, UpdateOrderStatusOutput } from './dto/update-order-status.input';
import { UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/auth/user.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { MyOrdersOutput } from './dto/my-orders.dto';
import { Role } from 'src/auth/role.decorator';
import { OrdersOutput } from './dto/orders.dto';

@UseGuards(UserGuard)
@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) { }

  @Mutation(() => CreateOrderOutput)
  createOrder (
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @AuthUser() user: User,
  ): Promise<CreateOrderOutput> {
    return this.orderService.create(createOrderInput, user);
  }

  @Query(() => MyOrdersOutput)
  myOrders (@AuthUser() user: User): Promise<MyOrdersOutput> {
    return this.orderService.myOrders(user);
  }

  @Query(() => OrdersOutput)
  @Role(['Admin'])
  orders (): Promise<OrdersOutput> {
    return this.orderService.orders();
  }

  @Mutation(() => UpdateOrderStatusOutput)
  @Role(['Admin'])
  updateOrderStatus (
    @Args('updateOrderInput') updateOrderInput: UpdateOrderStatusInput,
  ): Promise<UpdateOrderStatusOutput> {
  @Mutation(() => UpdatePaymentStatusOutput)
  @Role(['Admin'])
  updatePaymentStatus (
    @Args('updatePaymentStatusInput') updatePaymentStatusInput: UpdatePaymentStatusInput,
  ): Promise<UpdatePaymentStatusOutput> {
    return this.orderService.updatePaymentStatus(updatePaymentStatusInput)
  }

  @Query(() => GetOrderOutput)
  @Role(['Admin', 'User'])
  getOrder (
    @AuthUser() user: User,
    @Args('getOrderInput') getOrderInput: GetOrderInput
  ): Promise<GetOrderOutput> {
    return this.orderService.getOrder(user, getOrderInput)
  }
}
