import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";
import { CoreOutput } from "../../common/dtos/core.output";

@InputType()
export class ChangePasswordInput {
    @Field(() => String)
    @IsString()
    @MinLength(6)
    oldPassword: string;

    @Field(() => String)
    @IsString()
    @MinLength(6)
    newPassword: string;

}

@ObjectType()
export class changePasswordOutput extends CoreOutput { }