import { PickType, InputType, ObjectType, Field } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";
import { Verification } from "../entities/verification.entity";

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) { }

@ObjectType()
export class VerifyEmailOutput extends CoreOutput { }