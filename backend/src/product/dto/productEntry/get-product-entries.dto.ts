import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.output";
import { ProductEntry } from "src/product/entities/product.entity";

@InputType({ isAbstract: true })
export class GetProductEntriesInput extends PaginationInput {
    @Field(() => Int)
    @IsNumber()
    userId: number;
}

@ObjectType()
export class ProductEntriesOutput extends PaginationOutput {
    @Field(() => [ProductEntry])
    productEntries?: ProductEntry[];
}


@ObjectType()
export class GetProductEntriesOutput extends CoreOutput {
    @Field(() => ProductEntriesOutput, { nullable: true })
    data?: ProductEntriesOutput;
}