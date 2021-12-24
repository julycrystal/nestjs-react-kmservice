import { InputType, PickType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/core.output';
import { Address } from '../entities/address.entity';

@InputType()
export class CreateAddressInput extends PickType(Address, [
  "name",
  "address",
  "apartment",
  "country",
  "city",
  "note",
]) { }

@ObjectType()
export class CreateAddressOutput extends CoreOutput { }
