import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsNumber } from "class-validator";
import { CoreOutput } from "src/common/dtos/core.output";


@InputType()
export class ProductEntryDeleteInput {
    @Field(() => Int)
    @IsNumber()
    id: number;

    @Field(() => Boolean)
    @IsBoolean()
    reduceAmount: Boolean;
}

@ObjectType()
export class ProductEntryDeleteOutput extends CoreOutput { }