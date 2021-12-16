import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core.output";
import { Order } from "../entities/order.entity";

@ObjectType()
export class MyOrdersOutput extends CoreOutput {
    @Field(() => [Order])
    orders?: Order[];
}