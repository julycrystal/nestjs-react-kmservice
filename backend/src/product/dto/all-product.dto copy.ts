import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core.output";
import { Product } from "../entities/product.entity";

@ObjectType()
export class AllProductOutput extends CoreOutput {
    @Field(() => [Product])
    products?: Product[];
}