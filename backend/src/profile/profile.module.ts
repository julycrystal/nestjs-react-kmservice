import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileResolver } from "./profile.resolver";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Address, Product, User]),
  ],
  providers: [ProfileResolver, ProfileService],
})
export class ProfileModule { }
