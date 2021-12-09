import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product, ProductEntry, ProductImageItem } from './entities/product.entity';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      ProductImageItem,
      ProductEntry,
    ])
  ],
  providers: [
    ProductResolver,
    ProductService,
  ],
  controllers: [
    ProductController,
  ]
})
export class ProductModule { }
