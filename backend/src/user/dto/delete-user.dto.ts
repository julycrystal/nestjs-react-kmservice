import { ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";

@ObjectType()
export class DeleteUserOutput extends CoreOutput { }