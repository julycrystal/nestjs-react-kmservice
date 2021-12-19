import { InputType, Field, PickType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from '../../common/dtos/core.output';
import { Product } from '../entities/product.entity';

@InputType()
export class CreateProductInput extends PickType(
  Product,
  [
    'title',
    'description',
    'price',
    'discount',
    'showRemaining',
  ]
) {

  @Field(() => String,)
  @IsString()
  categoryName: string;

}

@ObjectType()
export class CreateProductOutput extends CoreOutput { }