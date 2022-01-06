import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Address } from '../profile/entities/address.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { MyOrdersOutput } from './dto/my-orders.dto';
import { OrdersOutput } from './dto/orders.dto';
import { UpdateOrderStatusInput, UpdateOrderStatusOutput } from './dto/update-order-status.input';
import { Order, OrderItem } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Address)
    private readonly adddressRepository: Repository<Address>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create (
    { billingAddressId, deliveryAddressId, orderItems }: CreateOrderInput,
    user: User,
  ): Promise<CreateOrderOutput> {
    let savedOrder: Order;
    try {
      const billingAddress = await this.adddressRepository.findOne({ id: billingAddressId })
      const deliveryAddress = await this.adddressRepository.findOne({ id: deliveryAddressId })
      if (!billingAddress) {
        throw new HttpException("Billing Address does not exists.", HttpStatus.NOT_FOUND)
      }
      if (!deliveryAddress) {
        throw new HttpException("Delivery Address does not exists.", HttpStatus.NOT_FOUND)
      }
      for (const orderItem of orderItems) {
        const product = await this.productRepository.findOne({ id: orderItem.productId });
        if (!product) {
          throw new HttpException("Product does not exists.", HttpStatus.NOT_FOUND)
        }
        if (product.quantity < orderItem.quantity) {
          throw new HttpException("Insufficient products in storage to place this order .", HttpStatus.BAD_REQUEST)
        }
      }

      const order = await this.orderRepository.create({
        billingAddress,
        deliveryAddress,
        customer: user,
      })
      savedOrder = await this.orderRepository.save(order);
      // order finished

      let totalAmount = 0;
      for (const orderItem of orderItems) {
        const product = await this.productRepository.findOne({ id: orderItem.productId });
        const discount = orderItem.discount || 0;
        const orderItem2Save = await this.orderItemRepository.create({
          order: savedOrder,
          productName: product.title,
          productPrice: product.price,
          discount: discount,
          quantity: orderItem.quantity,
        })
        totalAmount += product.price * orderItem.quantity - (discount * orderItem.quantity);

        // reduce product total amount
        const quantity = product.quantity - orderItem.quantity;
        await this.productRepository.update(product.id, { quantity });

        // save order item
        await this.orderItemRepository.save(orderItem2Save)
      }
      // order item finished

      // update order total amount
      await this.orderRepository.update(savedOrder.id, { totalAmount })
      return { ok: true }
    } catch (error) {
      if (savedOrder) {
        await this.orderRepository.delete({ id: savedOrder.id })
      }
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot create order."
      }
    }
  }

  async orders (): Promise<OrdersOutput> {
    try {
      const orders = await this.orderRepository.find({ relations: ['orderItems'] })
      return {
        orders,
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot create order."
      }
    }
  }

  async myOrders (user: User): Promise<MyOrdersOutput> {
    try {
      const orders = await this.orderRepository.find({ where: { customer: user }, relations: ['orderItems',] })
      return {
        orders,
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot create order."
      }
    }
  }

    orderId,
    paid,
  }: UpdatePaymentStatusInput): Promise<UpdatePaymentStatusOutput> {
    try {
      const order = await this.orderRepository.findOne({ id: orderId })
      if (!order) {
        throw new HttpException('order not found .', HttpStatus.NOT_FOUND)
      }
      await this.orderRepository.update(order.id, { paid })
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === 'HttpException') {
        throw error
      }
      return {
        ok: false,
        error: 'Cannot update order.',
      }
    }
  }
      }
      await this.orderRepository.update(order.id, { status });
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot create order."
      }
    }
  }
}
