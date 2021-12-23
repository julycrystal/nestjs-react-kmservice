import { ObjectType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { CoreEntity } from '../../common/entities/core.entity';
import { Address } from '../../profile/entities/address.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';


export enum OrderStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  RECIEVED = "RECIEVED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
}


export enum PaymentMethods {
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  STRIPE = "STRIPE",
}

registerEnumType(OrderStatus, { name: "OrderStatus" });
registerEnumType(PaymentMethods, { name: "PaymentMethods" });

@InputType("OrderInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {

  @Field(() => User)
  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  customer: User;

  @Field(() => Number)
  @Column({ type: Number, default: 1, })
  @IsNumber()
  @Min(1)
  totalAmount: number;

  @Field(() => Boolean)
  @Column({ type: Boolean, default: false, })
  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field(() => PaymentMethods)
  @IsEnum(PaymentMethods)
  @Column({ type: "enum", enum: PaymentMethods, default: PaymentMethods.CASH_ON_DELIVERY })
  paymentMethod: PaymentMethods;

  @Field(() => Address)
  @ManyToOne(() => Address)
  deliveryAddress: Address;

  @Field(() => Address)
  @ManyToOne(() => Address)
  billingAddress: Address;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, item => item.order, { onDelete: 'CASCADE' })
  orderItems: OrderItem[];
}


@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {

  @Field(() => Order)
  @ManyToOne(() => Order, order => order.orderItems, { onDelete: "CASCADE" })
  order: Order;

  @Field(() => String)
  @Column({ type: String, })
  @IsString()
  productName: string;

  @Field(() => Number)
  @Column({ type: Number, })
  @IsNumber()
  @Min(1)
  productPrice: number;

  @Field(() => Number)
  @Column({ type: Number, })
  @IsNumber()
  @Min(1)
  quantity: number;

  @Field(() => Number)
  @Column({ type: Number, default: 0 })
  @IsNumber()
  discount: number;
}