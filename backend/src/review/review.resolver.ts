import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { ReviewService } from './review.service'
import { Review } from './entities/review.entity'
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dto/create-review.input'
import { UpdateReviewInput } from './dto/update-review.input'
import { Role } from 'src/auth/role.decorator'
import { AuthUser } from 'src/auth/auth-user.decorator'
import { User } from 'src/user/entities/user.entity'

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) { }

  @Mutation(() => CreateReviewOutput)
  @Role(['User', 'Admin'])
  createReview (
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @AuthUser() authUser: User,
  ): Promise<CreateReviewOutput> {
    return this.reviewService.createReview(createReviewInput, authUser)
  }

  @Query(() => [Review], { name: 'review' })
  findAll () {
    return this.reviewService.findReviewsByProductId()
  }

  @Query(() => Review, { name: 'review' })
  findOne (@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.findOne(id)
  }

  @Mutation(() => Review)
  updateReview (
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput
  ) {
    return this.reviewService.update(updateReviewInput.id, updateReviewInput)
  }

  @Mutation(() => Review)
  removeReview (@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.remove(id)
  }
}
