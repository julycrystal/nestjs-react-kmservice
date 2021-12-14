import { InputType, Field, PickType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { ProductEntry } from 'src/product/entities/product.entity';

@InputType()
export class CreateProductEntryInput extends PickType(
    ProductEntry,
    [
        'amount',
        'entryDate'
    ]
) {

    @Field(() => Number,)
    @IsNumber()
    productId: number;
}

@ObjectType()
export class CreateProductEntryOutput extends CoreOutput { }