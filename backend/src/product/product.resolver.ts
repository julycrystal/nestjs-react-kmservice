import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput, CreateProductOutput } from './dto/create-product.dto';
import { Role } from '../auth/role.decorator';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { ProductDeleteInput, ProductDeleteOutput } from './dto/product-delete.dto';
import { GetProductInput, GetProductOutput } from './dto/get-product.dto';
import { AllProductOutput } from './dto/all-product.dto';
import { UpdateProductInput, UpdateProductOutput } from './dto/update-product.input';

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

  @Query(() => AllProductOutput)
  products (): Promise<AllProductOutput> {
    return this.productService.findAll();
  }

  @Query(() => GetProductOutput)
  product (@Args('getProductInput') getProductInput: GetProductInput): Promise<GetProductOutput> {
    return this.productService.findOne(getProductInput);
  }

  @Role(['Admin'])
  @Mutation(() => UpdateProductOutput)
  updateProduct (@Args('updateProductInput') updateProductInput: UpdateProductInput): Promise<UpdateProductOutput> {
    return this.productService.update(updateProductInput);
  }

  @Role(['Admin'])
  @Mutation(() => ProductDeleteOutput)
  async deleteProduct (
    @Args('productDeleteInput') productDeleteInput: ProductDeleteInput,
    @AuthUser() user: User
  ): Promise<ProductDeleteOutput> {
    return this.productService.remove(productDeleteInput, user);
  }

}
