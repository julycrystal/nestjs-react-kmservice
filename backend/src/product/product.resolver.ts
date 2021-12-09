import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput, CreateProductOutput } from './dto/create-product.dto';
import { UpdateProductInput } from './dto/update-product.input';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) { }

  @Role(['Admin'])
  @Mutation(() => CreateProductOutput)
  createProduct (
    @Args('createProductInput') createProductInput: CreateProductInput,
    @AuthUser() user: User,
  ): Promise<CreateProductOutput> {
    return this.productService.create(createProductInput, user);
  }

  @Query(() => [Product], { name: 'product' })
  findAll () {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  findOne (@Args('id', { type: () => Int }) id: number) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  updateProduct (@Args('updateProductInput') updateProductInput: UpdateProductInput) {
    return this.productService.update(updateProductInput.id, updateProductInput);
  }

  @Mutation(() => Product)
  removeProduct (@Args('id', { type: () => Int }) id: number) {
    return this.productService.remove(id);
  }
}
