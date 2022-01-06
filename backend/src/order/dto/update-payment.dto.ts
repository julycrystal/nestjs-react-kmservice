import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { OrderStatus } from '../entities/order.entity';

@InputType()
export class UpdatePaymentStatusInput {

    @Field(() => Number)
    @IsNumber()
    orderId: number;

    @Field(() => Boolean)
    @IsBoolean()
    paid: boolean;

}

@ObjectType()
export class UpdatePaymentStatusOutput extends CoreOutput { }
