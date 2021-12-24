import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CoreOutput } from 'src/common/dtos/core.output'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
import {
    ChangePasswordInput,
    changePasswordOutput,
} from './dto/change-password.dto'
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto'
import { DeleteUserOutput } from './dto/delete-user.dto'
import { GetUserInput, GetUserOutput } from './dto/get-user.dto'
import { GetUsersOutput } from './dto/get-users.dto'
import { LoginInput, LoginOutput } from './dto/login.dto'
import { MyProfileOutput } from './dto/my-profile.dto'
import { ToggleDisableInput } from './dto/toggle-disable-status.dto'
import { UpdateUserInput, UpdateUserOutput } from './dto/update-user.dto'
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Mutation(() => CreateUserOutput)
    register (
        @Args('createUserInput') createUserInput: CreateUserInput
    ): Promise<CreateUserOutput> {
        return this.userService.register(createUserInput)
    }

    @Mutation(() => LoginOutput)
    login (@Args('loginInput') loginInput: LoginInput): Promise<LoginOutput> {
        return this.userService.login(loginInput)
    }

    @Query(() => GetUsersOutput)
    @Role(['Admin'])
    getUsers (@Args('getUsersInput') getUsersInput: PaginationInput): Promise<GetUsersOutput> {
        return this.userService.getUsers(getUsersInput)
    }

    @Query(() => MyProfileOutput)
    @Role(['User', 'Admin'])
    myProfile (@AuthUser() user: User): Promise<MyProfileOutput> {
        return this.userService.myProfile(user)
    }

    @Role(['Admin'])
    @Query(() => GetUserOutput)
    getUser (
        @Args('getUserInput') getUserInput: GetUserInput
    ): Promise<GetUserOutput> {
        return this.userService.getUser(getUserInput)
    }

    @Mutation(() => UpdateUserOutput)
    @Role(['User', 'Admin'])
    updateProfile (
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @AuthUser() user: User
    ): Promise<UpdateUserOutput> {
        return this.userService.update(updateUserInput, user)
    }

    @Mutation(() => changePasswordOutput)
    @Role(['User', 'Admin'])
    changePassword (
        @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
        @AuthUser() user: User
    ): Promise<changePasswordOutput> {
        return this.userService.changePassword(changePasswordInput, user)
    }

    @Mutation(() => DeleteUserOutput)
    @Role(['User', 'Admin'])
    deleteAccount (@AuthUser() user: User): Promise<DeleteUserOutput> {
        return this.userService.deleteAccount(user)
    }

    @Mutation(() => VerifyEmailOutput)
    verifyEmail (
        @Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput
    ): Promise<VerifyEmailOutput> {
        return this.userService.verifyEmail(verifyEmailInput)
    }

    @Role(['Admin'])
    @Mutation(() => CoreOutput)
    disableAccount (
        @AuthUser() user: User,
        @Args('toggleDisableInput') toggleDisableInput: ToggleDisableInput
    ): Promise<CoreOutput> {
        return this.userService.disableAccount(toggleDisableInput)
    }

    @Role(['Admin'])
    @Mutation(() => CoreOutput)
    enableAccount (
        @AuthUser() user: User,
        @Args('toggleDisableInput') toggleDisableInput: ToggleDisableInput
    ): Promise<CoreOutput> {
        return this.userService.enableAccount(toggleDisableInput)
    }
}
