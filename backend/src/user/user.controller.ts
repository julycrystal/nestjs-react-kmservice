import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { UpdateUserInput, UpdateUserOutput } from './dto/update-user.dto';
import { GetUserInput, GetUserOutput } from './dto/get-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { Role } from '../auth/role.decorator';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { ChangePasswordInput, changePasswordOutput } from './dto/change-password.dto';
import { GetUsersOutput } from './dto/get-users.dto';
import { DeleteUserOutput } from './dto/delete-user.dto';
import { MyProfileOutput } from './dto/my-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  register (@Body() createUserDto: CreateUserInput): Promise<CreateUserOutput> {
    return this.userService.register(createUserDto);
  }


  @Post('login')
  login (@Body() loginDto: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginDto);
  }

  @Get()
  @Role(['Admin'])
  findAll (): Promise<GetUsersOutput> {
    return this.userService.findAll();
  }

  @Get('profile')
  @Role(['User', 'Admin'])
  myProfile (@AuthUser() user: User): Promise<MyProfileOutput> {
    return this.userService.myProfile(user);
  }

  @Role(['Admin'])
  @Get(':id')
  findOne (@Param() getUserDto: GetUserInput): Promise<GetUserOutput> {
    return this.userService.findOne(getUserDto);
  }

  @Patch()
  @Role(['User', 'Admin'])
  update (
    @Body() updateUserDto: UpdateUserInput,
    @AuthUser() user: User
  ): Promise<UpdateUserOutput> {
    return this.userService.update(updateUserDto, user);
  }

  @Patch('change-password')
  @Role(['User', 'Admin'])
  changePassword (
    @Body() changePasswordDto: ChangePasswordInput,
    @AuthUser() user: User
  ): Promise<changePasswordOutput> {
    return this.userService.changePassword(changePasswordDto, user);
  }

  @Delete()
  @Role(['User'])
  deleteAccount (@AuthUser() user: User): Promise<DeleteUserOutput> {
    return this.userService.deleteAccount(user);
  }

  @Get('/confirm/:code')
  verifyEmail (@Param() verifyEmailDto): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(verifyEmailDto)
  }
}
