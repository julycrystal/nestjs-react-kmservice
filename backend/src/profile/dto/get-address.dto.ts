import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/core.output";
import { Address } from "../entities/address.entity";

@ObjectType()
export class AddressesOutput extends CoreOutput {
    @Field(() => [Address])
    addresses?: Address[];
}
