import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationOutput } from "src/common/dtos/pagination.output";
import { Order } from "../entities/order.entity";
@ObjectType()
export class MyOrderList extends PaginationOutput {
    @Field(() => [Order])
    orders?: Order[];
}

@ObjectType()
export class MyOrdersOutput extends CoreOutput {
    @Field(() => MyOrderList, { nullable: true })
    data?: MyOrderList;
}