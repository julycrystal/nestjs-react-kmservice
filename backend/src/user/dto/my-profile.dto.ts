import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

@ObjectType()
export class MyProfileOutput extends CoreOutput {
    @Field(() => User, { nullable: true })
    user?: User;
}