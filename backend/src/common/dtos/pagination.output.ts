import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

@ObjectType()
export class PaginationOutput {
    @Field(() => Number,)
    totalPages: number;

    @Field(() => Number,)
    totalItems: number;

    @Field(() => Number,)
    limit: number;

    @Field(() => Number,)
    currentPage: number;

    @Field(() => Number,)
    currentPageItems: number;
}

@InputType("PaginationInput", { isAbstract: true })
@ObjectType()
export class PaginationInput {
    @Field(() => Number, { defaultValue: 1 })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    pageNumber?: number;

    @Field(() => Number, { defaultValue: 10 })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    limit?: number;
}
