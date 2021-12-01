import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

@InputType()
export class CreateUserInput extends PickType(User, [
    'name',
    'password',
    'email',
]) { }

@ObjectType()
export class CreateUserOutput extends CoreOutput { }