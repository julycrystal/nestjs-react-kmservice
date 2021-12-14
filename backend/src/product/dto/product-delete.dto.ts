import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import { CoreOutput } from "src/common/dtos/core.output";
import { Product } from "../entities/product.entity";

@InputType()
export class ProductDeleteInput {
    @IsNumber()
    @Field(() => Number)
    id: number;
}


@ObjectType()
export class ProductDeleteOutput extends CoreOutput { }