import { ObjectType, Field } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core.output";
import { Product } from "../entities/product.entity";

@ObjectType()
export class GetPopularProductsOutput extends CoreOutput {
    @Field(() => [Product])
    products?: Product[];
}

@ObjectType()
export class GetNewestProductsOutput extends CoreOutput {
    @Field(() => [Product])
    products?: Product[];
}