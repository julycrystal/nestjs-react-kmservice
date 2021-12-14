import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import { CoreOutput } from "src/common/dtos/core.output";
import { Product } from "../entities/product.entity";

@InputType()
export class GetProductInput {
    @Field(() => Int)
    @IsNumber()
    id: number;
}

@ObjectType()
export class GetProductOutput extends CoreOutput {
    @Field(() => Product)
    product?: Product;
}