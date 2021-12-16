import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { OrderStatus } from '../entities/order.entity';

@InputType()
export class UpdateOrderStatusInput {

  @Field(() => Number)
  @IsNumber()
  orderId: number;

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

@ObjectType()
export class UpdateOrderStatusOutput extends CoreOutput { }
