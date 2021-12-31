import { Module } from '@nestjs/common';
import { UserService } from './user.service';
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
  exports: [UserService],
})
export class UserModule {
}
