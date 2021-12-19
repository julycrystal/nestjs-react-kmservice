import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CoreOutput } from '../../common/dtos/core.output';

@InputType()
export class CreateOrderInput {

  @Field(() => Number)
  @IsNumber()
  billingAddressId: number;

  @Field(() => Number)
  @IsNumber()
  deliveryAddressId: number;

  @Field(() => [OrderItemInput])
  @IsNotEmpty()
  orderItems: OrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput { }

@InputType("OrderItemInputType", { isAbstract: true })
class OrderItemInput {
  @Field(() => Number)
  @IsNumber()
  productId: number;

  @Field(() => Number)
  @IsNumber()
  quantity: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  discount?: number;
}