import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) { }

@ObjectType()
export class LoginOutput extends CoreOutput {
    @Field(() => String, { nullable: true })
    token?: string;

    @Field(() => User, { nullable: true })
    user?: User;
}