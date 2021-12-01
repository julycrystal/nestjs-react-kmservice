import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

@InputType()
export class GetUserInput extends PickType(User, ['id']) { }

@ObjectType()
export class GetUserOutput extends CoreOutput {
    @Field(() => User, { nullable: true })
    user?: User;
}