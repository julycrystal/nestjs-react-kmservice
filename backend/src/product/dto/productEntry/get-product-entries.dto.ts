import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core.output";
import { ProductEntry } from "src/product/entities/product.entity";

@InputType()
export class GetProductEntriesInput {
    @Field(() => Int)
    id: number;
}

@ObjectType()
export class GetProductEntriesOutput extends CoreOutput {
    @Field(() => [ProductEntry])
    productEntries?: ProductEntry[];
}