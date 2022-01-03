import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from '../common/dtos/core.output';
import { User, UserRole } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { GetProductsOutput } from './dto/all-product.dto';
import { CreateProductInput, CreateProductOutput } from './dto/create-product.dto';
import { ProductDeleteInput, ProductDeleteOutput } from './dto/product-delete.dto';
import { GetProductInput, GetProductOutput } from './dto/get-product.dto';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { UpdateProductInput, UpdateProductOutput } from './dto/update-product.input';
import { extractFileNameFromUrl, removeProductPicture, removeProductPictures } from 'src/utils/file.utils';
import { PaginationInput } from 'src/common/dtos/pagination.output';
import { GetNewestProductsOutput, GetPopularProductsOutput } from './dto/get-popular-products.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private configService: ConfigService,
  ) { }

  private async getOrCreateCategory (categoryName: string): Promise<Category> {
    try {
      const existingCategory = await this.categoryRepository.findOne({ name: categoryName });
      if (existingCategory) {
        return existingCategory;
      }
      // create new category;
      const newCategory = await this.categoryRepository.create({ name: categoryName });
      await this.categoryRepository.save(newCategory)
      return newCategory;
    } catch (error) {
      return null;
    }
  }

  async create (createProductInput: CreateProductInput, user: User): Promise<CreateProductOutput> {
    try {
      if (user.role !== UserRole.Admin) {
        throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED)
      }
      const category = await this.getOrCreateCategory(createProductInput.categoryName);
      if (!category) {
        throw new HttpException('Cannot create product.', HttpStatus.BAD_REQUEST);
      }
      const product = await this.productRepository.create({ ...createProductInput, category })
      const savedProduct = await this.productRepository.save(product);
      return {
        ok: true,
        productId: savedProduct.id
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't create product.",
      };
    }
  }

  async uploadProductCoverImage (
    productId: number,
    filename: string
  ): Promise<CoreOutput> {
    try {
      if (!filename) {
        throw new HttpException("image field is required..", HttpStatus.BAD_REQUEST);
      }
      if (!filename) {
        throw new HttpException("image file is required.", HttpStatus.BAD_REQUEST);
      }
      const product = await this.productRepository.findOne({ id: productId });
      if (!product) {
        throw new HttpException("Product not found.", HttpStatus.BAD_REQUEST);
      }
      if (product.coverImage) {
        removeProductPicture(extractFileNameFromUrl(product.coverImage))
      }
      product.coverImage =
        this.configService.get("END_POINT") + `/products/${filename}`;
      await this.productRepository.save(product);
      return {
        ok: true,
      };
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      removeProductPicture(filename)
      return {
        ok: false,
        error: "Cannot upload profile picture.",
      };
    }
  }

  async getProducts ({ limit, pageNumber }: PaginationInput): Promise<GetProductsOutput> {
    try {
      const totalProducts = await this.productRepository.count();
      const totalPages = Math.ceil(totalProducts / limit);
      if (pageNumber > totalPages) {
        pageNumber = totalPages;
      }
      const products = await this.productRepository.find({
        relations: ["category",],
        take: limit,
        order: {
          id: "DESC"
        },
        skip: (pageNumber * limit - limit),
      });
      return {
        ok: true,
        data: {
          products,
          limit,
          totalPages,
          totalItems: totalProducts,
          currentPage: pageNumber,
          currentPageItems: products.length,
        }
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get products.",
      };
    }
  }

  async getPopularProducts (): Promise<GetPopularProductsOutput> {
    try {
      const products = await this.productRepository.find({
        relations: ["category",],
        take: 10,
        order: {
          views: "DESC"
        },
      });
      return {
        ok: true,
        products,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get popular products.",
      };
    }
  }

  async getNewestProducts (): Promise<GetNewestProductsOutput> {
    try {
      const products = await this.productRepository.find({
        relations: ["category",],
        take: 10,
        order: {
          createdAt: "DESC"
        },
      });
      return {
        ok: true,
        products,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get newest products.",
      };
    }
  }



  async getProduct ({ id }: GetProductInput): Promise<GetProductOutput> {
    try {
      const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] })
      if (!product) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
      product.views = product.views + 1;
      await this.productRepository.save(product);
      return {
        ok: true,
        product,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get products.",
      };
    }
  }

  async update (updateProductInput: UpdateProductInput): Promise<UpdateProductOutput> {
    try {
      const product = await this.productRepository.findOne({ where: { id: updateProductInput.id } })
      if (!product) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
      await this.productRepository.update(updateProductInput.id, { ...updateProductInput })
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get products.",
      };
    }
  }

  async remove ({ id }: ProductDeleteInput, user: User): Promise<ProductDeleteOutput> {
    try {
      if (user.role !== UserRole.Admin) {
        throw new HttpException('Insufficient permissions.', HttpStatus.UNAUTHORIZED);
      }
      const product = await this.productRepository.findOne({ where: { id }, relations: ['images'] })
      if (!product) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
      await this.productRepository.delete({ id });
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get products.",
      };
    }
  }
}
