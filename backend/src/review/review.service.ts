import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from 'src/product/entities/product.entity'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dto/create-review.input'
import { UpdateReviewInput } from './dto/update-review.input'
import { Review } from './entities/review.entity'

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async createReview (
    { rating, comment, productId }: CreateReviewInput,
    user: User
  ): Promise<CreateReviewOutput> {
    try {
      const product = await this.productRepository.findOne({ id: productId })
      if (!product) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND)
      }
      const review = await this.reviewRepository.create({
        rating,
        comment,
        user,
        product,
      })
      await this.reviewRepository.save(review)
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === 'HttpException') {
        throw error
      }
      if (error.code && error.code === '23505') {
        return {
          ok: false,
          error: `This product is already revied by this user.`
        }
      }
      return {
        ok: false,
        error: 'Cannot create review.',
      }
    }
  }

  findReviewsByProductId () {
    return `This action returns all review`
  }

  findOne (id: number) {
    return `This action returns a #${id} review`
  }

  update (id: number, updateReviewInput: UpdateReviewInput) {
    return `This action updates a #${id} review`
  }

  remove (id: number) {
    return `This action removes a #${id} review`
  }
}
