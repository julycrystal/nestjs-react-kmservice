import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Product, ProductEntry } from './entities/product.entity';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ProductDeleteInput, ProductDeleteOutput } from './dto/product-delete.dto';
import { GetProductInput, GetProductOutput } from './dto/get-product.dto';
import { ProductEntryService } from './productEntry.service';
import { CreateProductEntryOutput, CreateProductEntryInput } from './dto/productEntry/create-entry.dto';
import { GetProductEntryOutput, GetProductEntryInput } from './dto/productEntry/get-product-entry.dto';
import { ProductEntryDeleteOutput, ProductEntryDeleteInput } from './dto/productEntry/product-entry-delete.dto';
import { UpdateProductEntryInput, UpdateProductEntryOutput } from './dto/productEntry/update-product-entry.dto';
import { GetProductEntriesByProductInput, GetProductEntriesInput, GetProductEntriesOutput } from './dto/productEntry/get-product-entries.dto';

@Resolver(() => ProductEntry)
export class ProductEntryResolver {
    constructor(private readonly productEntryService: ProductEntryService) { }

    @Role(['Admin'])
    @Mutation(() => CreateProductEntryOutput)
    createProductEntry (
        @Args('createProductEntryInput') createProductEntryInput: CreateProductEntryInput,
        @AuthUser() user: User,
    ): Promise<CreateProductEntryOutput> {
        return this.productEntryService.createProductEntry(createProductEntryInput, user);
    }

    @Role(['Admin'])
    @Query(() => GetProductEntriesOutput)
    getProductEntriesByUser (@Args("getProductEntriesInput") getProductEntriesInput: GetProductEntriesInput): Promise<GetProductEntriesOutput> {
        return this.productEntryService.getProductEntriesByUser(getProductEntriesInput);
    }

    @Role(['Admin'])
    @Query(() => GetProductEntriesOutput)
    getProductEntriesByProduct (@Args("getProductEntriesByProductInput") getProductEntriesByProductInput: GetProductEntriesByProductInput): Promise<GetProductEntriesOutput> {
        return this.productEntryService.getProductEntriesByProduct(getProductEntriesByProductInput);
    }

    @Role(['Admin'])
    @Query(() => GetProductEntryOutput)
    getProductEntry (@Args('getProductEntryInput') getProductEntryInput: GetProductEntryInput): Promise<GetProductEntryOutput> {
        return this.productEntryService.getProductEntry(getProductEntryInput);
    }

    @Role(['Admin'])
    @Mutation(() => UpdateProductEntryOutput)
    updateProductEntry (@Args('updateProductEntryInput') updateProductEntryInput: UpdateProductEntryInput): Promise<UpdateProductEntryOutput> {
        return this.productEntryService.updateProductEntry(updateProductEntryInput);
    }

    @Role(['Admin'])
    @Mutation(() => ProductEntryDeleteOutput)
    deleteProductEntry (
        @Args('productEntryDeleteInput') productEntryDeleteInput: ProductEntryDeleteInput,
        @AuthUser() user: User
    ): Promise<ProductEntryDeleteOutput> {
        return this.productEntryService.deleteProductEntry(productEntryDeleteInput);
    }

}
