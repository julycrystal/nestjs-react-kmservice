import { DynamicModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '../jwt/jwt.module';
import { Verification } from './entities/verification.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Verification
    ]),
    JwtModule,
  ],
  providers: [
    UserService,
    UserResolver,
  ],
  controllers: [
    UserController
  ],
  exports: [UserService],
})
export class UserModule {
}
