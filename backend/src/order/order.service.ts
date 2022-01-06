import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '../product/entities/product.entity'
import { Address } from '../profile/entities/address.entity'
import { User, UserRole } from '../user/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto'
import { MyOrdersOutput } from './dto/my-orders.dto'
import { OrdersOutput } from './dto/orders.dto'
import {
  UpdateOrderStatusInput,
  UpdateOrderStatusOutput,
} from './dto/update-order-status.input'
import { Order, OrderItem, OrderStatus } from './entities/order.entity'
import { PaginationInput } from 'src/common/dtos/pagination.output'
import { GetOrderInput, GetOrderOutput } from './dto/get-order.dto'
import { CancelOrderInput, CancelOrderOutput } from './dto/cancel-order.dto'
import { UpdatePaymentStatusInput, UpdatePaymentStatusOutput } from './dto/update-payment.dto'

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
    private readonly productRepository: Repository<Product>
  ) { }

  async create (
    { billingAddressId, deliveryAddressId, orderItems }: CreateOrderInput,
    user: User
  ): Promise<CreateOrderOutput> {
    let savedOrder: Order
    try {
      const billingAddress = await this.adddressRepository.findOne({
        id: billingAddressId,
      })
      const deliveryAddress = await this.adddressRepository.findOne({
        id: deliveryAddressId,
      })
      if (!billingAddress) {
        throw new HttpException(
          'Billing Address does not exists.',
          HttpStatus.NOT_FOUND
        )
      }
      if (!deliveryAddress) {
        throw new HttpException(
          'Delivery Address does not exists.',
          HttpStatus.NOT_FOUND
        )
      }
      for (const orderItem of orderItems) {
        const product = await this.productRepository.findOne({
          id: orderItem.productId,
        })
        if (!product) {
          throw new HttpException(
            'Product does not exists.',
            HttpStatus.NOT_FOUND
          )
        }
        if (product.quantity < orderItem.quantity) {
          throw new HttpException(
            'Insufficient products in storage to place this order .',
            HttpStatus.BAD_REQUEST
          )
        }
      }

      const order = await this.orderRepository.create({
        billingAddress,
        deliveryAddress,
        customer: user,
      })
      savedOrder = await this.orderRepository.save(order)
      // order finished

      let totalAmount = 0
      for (const orderItem of orderItems) {
        const product = await this.productRepository.findOne({
          id: orderItem.productId,
        })
        const discount = orderItem.discount || 0
        const orderItem2Save = await this.orderItemRepository.create({
          order: savedOrder,
          productName: product.title,
          productPrice: product.price,
          discount: discount,
          quantity: orderItem.quantity,
        })
        totalAmount +=
          product.price * orderItem.quantity - discount * orderItem.quantity

        // reduce product total amount
        const quantity = product.quantity - orderItem.quantity
        await this.productRepository.update(product.id, { quantity })

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
      if (error.name && error.name === 'HttpException') {
        throw error
      }
      return {
        ok: false,
        error: 'Cannot create order.',
      }
    }
  }

  async orders ({
    limit = 10,
    pageNumber = 1,
  }: PaginationInput): Promise<OrdersOutput> {
    try {
      const totalOrders = await this.orderRepository.count()
      const totalPages = Math.ceil(totalOrders / limit)
      if (pageNumber > totalPages) {
        pageNumber = totalPages
      }
      const orders = await this.orderRepository.find({
        relations: ['orderItems', 'customer'],
        take: limit,
        order: {
          id: 'DESC',
        },
        skip: pageNumber * limit - limit,
      })

      return {
        data: {
          orders,
          limit,
          totalPages,
          currentPage: pageNumber,
          totalItems: totalOrders,
          currentPageItems: orders.length,
        },
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === 'HttpException') {
        throw error
      }
      return {
        ok: false,
        error: 'Cannot get orders.',
      }
    }
  }

  async myOrders (
    user: User,
    { limit = 10, pageNumber = 1 }: PaginationInput
  ): Promise<MyOrdersOutput> {
    try {
      const totalOrders = await this.orderRepository.count({
        where: { customer: user },
      })
      const totalPages = Math.ceil(totalOrders / limit)
      if (pageNumber > totalPages) {
        pageNumber = totalPages
      }
      const orders = await this.orderRepository.find({
        where: { customer: user },
        relations: ['orderItems', 'customer'],
        take: limit,
        order: {
          id: 'DESC',
        },
        skip: pageNumber * limit - limit,
      })
      return {
        data: {
          orders,
          limit,
          totalPages,
          currentPage: pageNumber,
          totalItems: totalOrders,
          currentPageItems: orders.length,
        },
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === 'HttpException') {
        throw error
      }
      return {
        ok: false,
        error: 'Cannot get orders.',
      }
    }
  }

  async updateStatus ({
    orderId,
    status,
  }: UpdateOrderStatusInput): Promise<UpdateOrderStatusOutput> {
    try {
      const order = await this.orderRepository.findOne({ id: orderId })
      if (!order) {
        throw new HttpException('order not found .', HttpStatus.NOT_FOUND)
      }
      await this.orderRepository.update(order.id, { status })
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

  async updatePaymentStatus ({
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

  async cancelOrder ({
    orderId,
  }: CancelOrderInput, user: User): Promise<CancelOrderOutput> {
    try {
      const order = await this.orderRepository.findOne({ id: orderId }, { relations: ['customer'] })
      if (!order || (order.customer.id !== user.id)) {
        throw new HttpException('order not found .', HttpStatus.NOT_FOUND)
      }
      await this.orderRepository.update(order.id, { status: OrderStatus.CANCELLED })
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

  async getOrder (
    user: User,
    { orderId }: GetOrderInput
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orderRepository.findOne(
        { id: orderId },
        {
          relations: [
            'customer',
            'orderItems',
            'billingAddress',
            'deliveryAddress',
          ],
        }
      )
      if (user.role === UserRole.User && user.id !== order.customer.id) {
        throw new HttpException("Order not found.", HttpStatus.NOT_FOUND)
      }
      return {
        ok: true,
        order,
      }
    } catch (error) {
      if (error.name && error.name === 'HttpException') {
        throw error
      }
      return {
        ok: false,
        error: 'Cannot get order.',
      }
    }
  }
}
