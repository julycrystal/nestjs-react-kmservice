import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

@InputType()
export class UpdateUserRoleInput extends PickType(User, [
    'role',
]) {
    @Field(() => Number)
    @IsNumber()
    userId: number;
}

@ObjectType()
export class UpdateUserRoleOutput extends CoreOutput { }