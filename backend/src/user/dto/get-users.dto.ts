import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

@ObjectType()
export class GetUsersOutput extends CoreOutput {
    @Field(() => [User], { nullable: true })
    users?: User[];
}