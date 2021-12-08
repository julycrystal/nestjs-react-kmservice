import { InputType, PickType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.output';
import { Address } from '../entities/address.entity';

@InputType()
export class DeleteAddressInput extends PickType(Address, [
    'id'
]) { }

@ObjectType()
export class DeleteAddressOutput extends CoreOutput { }
