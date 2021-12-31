import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationOutput } from "src/common/dtos/pagination.output";
import { Product } from "../entities/product.entity";

@ObjectType()
export class ProductsOutput extends PaginationOutput {
    @Field(() => [Product])
    products?: Product[];
}

@ObjectType()
export class GetProductsOutput extends CoreOutput {
    @Field(() => ProductsOutput, { nullable: true })
    data?: ProductsOutput;
}