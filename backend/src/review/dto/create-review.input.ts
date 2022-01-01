import { InputType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { Review } from '../entities/review.entity';

@InputType()
export class CreateReviewInput extends PickType(Review, ['rating', 'comment']) {
  @IsInt()
  @Field(() => Number)
  productId: number;
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput { }