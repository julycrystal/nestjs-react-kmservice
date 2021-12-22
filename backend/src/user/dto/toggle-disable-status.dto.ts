import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, } from "class-validator";

@InputType()
export class ToggleDisableInput {
    @Field(() => Number)
    @IsNumber()
    userId: number;
}
