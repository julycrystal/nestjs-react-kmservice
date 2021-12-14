import { InputType, Field, Int, PartialType, ObjectType, OmitType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { CreateProductEntryInput } from './create-entry.dto';

@InputType()
export class UpdateProductEntryInput extends PartialType(OmitType(CreateProductEntryInput, ['productId'])) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}


@ObjectType()
export class UpdateProductEntryOutput extends CoreOutput {
}