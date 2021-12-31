import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product, ProductEntry } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductEntryResolver } from './productEntry.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ProductEntryService } from './productEntry.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      ProductImageItem,
      User,
      ProductEntry,
    ]),
    AuthModule,
    UserModule,
  ],
  providers: [
    ProductResolver,
    ProductService,
    ProductEntryResolver,
    ProductEntryService,
  ],
  controllers: [
    ProductController,
  ]
})
export class ProductModule { }
