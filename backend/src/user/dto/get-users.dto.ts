import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationOutput } from "src/common/dtos/pagination.output";
import { User } from "../entities/user.entity";

@ObjectType()
export class UsersOutput extends PaginationOutput {
    @Field(() => [User], { nullable: true })
    users?: User[];
}

@ObjectType()
export class GetUsersOutput extends CoreOutput {
    @Field(() => UsersOutput, { nullable: true })
    data?: UsersOutput;
}