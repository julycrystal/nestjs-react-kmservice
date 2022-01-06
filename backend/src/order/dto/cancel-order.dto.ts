import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { OrderStatus } from '../entities/order.entity';

@InputType()
export class CancelOrderInput {

    @Field(() => Number)
    @IsNumber()
    orderId: number;
}

@ObjectType()
export class CancelOrderOutput extends CoreOutput { }
