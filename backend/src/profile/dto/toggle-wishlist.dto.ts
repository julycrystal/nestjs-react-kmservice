import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';

@InputType()
export class ToggleWishlistInput {
    @Type(() => Number)
    @Field(() => Number)
    @IsNumber()
    id: number;
}

@ObjectType()
export class ToggleWishlistOutput extends CoreOutput { }
