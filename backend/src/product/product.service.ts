import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from '../common/dtos/core.output';
import { User, UserRole } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AllProductOutput } from './dto/all-product.dto';
import { CreateProductInput, CreateProductOutput } from './dto/create-product.dto';
import { ProductDeleteInput, ProductDeleteOutput } from './dto/product-delete.dto';
import { GetProductInput, GetProductOutput } from './dto/get-product.dto';
import { Category } from './entities/category.entity';
import { Product, ProductImageItem } from './entities/product.entity';
import { UpdateProductInput, UpdateProductOutput } from './dto/update-product.input';
import { extractFileNameFromUrl, removeProductPicture, removeProductPictures } from 'src/utils/file.utils';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ProductImageItem)
    private readonly productImageItemRepository: Repository<ProductImageItem>,
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
      await this.productRepository.save(product);
      return {
        ok: true,
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

  async uploadProductPhotos (
    files: string[],
    productId: string,
  ): Promise<CoreOutput> {
    try {
      if (!files || (files && files.length < 1)) {
        throw new HttpException("images field is required..", HttpStatus.BAD_REQUEST);
      }
      const product = await this.productRepository.findOne({ id: +productId }, { relations: ['images'] });
      if (!product) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
      if (product.images) {
        let fileNames = product.images.map(image => extractFileNameFromUrl(image.imageUrl))
        removeProductPictures(fileNames)
      }
      await this.productImageItemRepository.delete({ product });
      await files.forEach(async file => {
        let createdProductImageItem = await this.productImageItemRepository.create({
          imageUrl: this.configService.get("END_POINT") + `/product/${file}`,
          product,
        });
        await this.productImageItemRepository.save(createdProductImageItem);
      });
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      removeProductPictures(files)
      return {
        ok: false,
        error: "Can't upload photos.",
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

  async findAll (): Promise<AllProductOutput> {
    try {
      const products = await this.productRepository.find({ relations: ['images', 'category'] })
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
        error: "Can't get products.",
      };
    }
  }

  async findOne ({ id }: GetProductInput): Promise<GetProductOutput> {
    try {
      const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] })
      if (!product) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
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
      if (product.images) {
        let fileNames = product.images.map(image => extractFileNameFromUrl(image.imageUrl))
        removeProductPictures(fileNames)
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
