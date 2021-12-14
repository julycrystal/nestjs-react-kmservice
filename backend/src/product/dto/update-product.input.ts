import { CreateProductInput } from './create-product.dto';
import { InputType, Field, Int, PartialType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.output';
import { IsNumber } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Number)
  @IsNumber()
  id: number;
}

@ObjectType()
export class UpdateProductOutput extends CoreOutput {
}
