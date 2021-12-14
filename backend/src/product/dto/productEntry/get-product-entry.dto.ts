import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import { CoreOutput } from "src/common/dtos/core.output";
import { ProductEntry } from "src/product/entities/product.entity";

@InputType()
export class GetProductEntryInput {
    @Field(() => Int)
    @IsNumber()
    id: number;
}

@ObjectType()
export class GetProductEntryOutput extends CoreOutput {
    @Field(() => ProductEntry)
    productEntry?: ProductEntry;
}