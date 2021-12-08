import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { JwtModule } from './jwt/jwt.module';
import { User } from './user/entities/user.entity';
import { Verification } from './user/entities/verification.entity';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { Product, ProductEntry, ProductImageItem } from './product/entities/product.entity';
import { Category } from './product/entities/category.entity';
import { Review } from './product/entities/review.entity';
import { ProfileModule } from './profile/profile.module';
import { Address } from './profile/entities/address.entity';

@Module({
  imports: [
    LoggerModule.forRoot(),
    GraphQLModule.forRoot({
      playground: process.env.NODE_ENV === "dev",
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return { token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY] };
      }
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : "",
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'production', 'test')
          .required(),
        PRIVATE_KEY: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        END_POINT: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      logging: true,
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User,
        Verification,
        Product,
        ProductImageItem,
        Category,
        ProductEntry,
        Review,
        Address,
      ],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    JwtModule.forRoot({ privateKey: process.env.PRIVATE_KEY }),
    ProfileModule,
  ],
})
export class AppModule { }
