import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CoreOutput } from '../../common/dtos/core.output';
import { CreateAddressInput } from './create-address.dto';

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {
    @IsNotEmpty()
    @Field(() => String)
    id: number;
}

@ObjectType()
export class UpdateAddressOutput extends CoreOutput { }
