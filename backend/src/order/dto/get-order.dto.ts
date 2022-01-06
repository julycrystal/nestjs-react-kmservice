import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsInt } from "class-validator";
import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationOutput } from "src/common/dtos/pagination.output";
import { Order } from "../entities/order.entity";

@InputType()
export class GetOrderInput {
    @Field(() => Number)
    @IsInt()
    orderId: number;
}

@ObjectType()
export class GetOrderOutput extends CoreOutput {
    @Field(() => Order)
    order?: Order;
}
