import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordInput, changePasswordOutput } from '../dto/change-password.dto';
import { CreateUserInput, CreateUserOutput } from '../dto/create-user.dto';
import { DeleteUserOutput } from '../dto/delete-user.dto';
import { GetUserOutput } from '../dto/get-user.dto';
import { GetUsersOutput } from '../dto/get-users.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { MyProfileOutput } from '../dto/my-profile.dto';
import { UpdateUserOutput } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userModelStub, getUserStub } from './stubs/user.stub';

jest.mock('../user.service.ts')

describe('UserController', () => {
  let userService: UserService;
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    describe('when login is called', () => {
      let loginResult: LoginOutput;
      let loginDTO: LoginInput = {
        email: getUserStub().email,
        password: '123456',
      }
      beforeEach(async () => {
        loginResult = await controller.login(loginDTO);
      });
      test('then it should call userService', () => {
        expect(userService.login).toHaveBeenCalled();
      })
      test('then it should return a user with token', () => {
        expect(loginResult.ok).toEqual(true);
        expect(loginResult.error).toEqual(undefined);
        expect(loginResult.user).toEqual(getUserStub());
        expect(loginResult.token).toEqual(expect.any(String));
      })
    })
  })

  describe('register()', () => {
    describe('when register is called', () => {
      let createUserResult: CreateUserOutput;
      let registerDTO: CreateUserInput = {
        email: getUserStub().email,
        password: '123456',
        name: getUserStub().name,
      }
      beforeEach(async () => {
        createUserResult = await controller.register(registerDTO);
      });
      test('then it should call userService', () => {
        expect(userService.register).toHaveBeenCalled();
      })
      test('then it should return a ok:true', () => {
        expect(createUserResult.ok).toEqual(true);
        expect(createUserResult.error).toEqual(undefined);
      })
    })
  })

  describe('findAll()', () => {
    describe('when findAll is called', () => {
      let users: GetUsersOutput;

      beforeEach(async () => {
        users = await controller.findAll();
      });

      test('then it should call userService', () => {
        expect(userService.findAll).toHaveBeenCalled();
      })

      test('then it should return a list of user', () => {
        expect(users.ok).toEqual(true);
        expect(users.error).toEqual(undefined);
        expect(users.users).toEqual([getUserStub()]);
      })
    })

  })

  describe('myProfile()', () => {
    describe('when myProfile is called', () => {
      let users: MyProfileOutput;
      let user: User = userModelStub();
      beforeEach(async () => {
        users = await controller.myProfile(user);
      });

      test('then it should call userService', () => {
        expect(userService.myProfile).toHaveBeenCalled();
      })

      test('then it should return a user', () => {
        expect(users.ok).toEqual(true);
        expect(users.error).toEqual(undefined);
        expect(users.user).toEqual(getUserStub());
      })
    })

  })

  describe('finOne()', () => {
    describe('when findOne is called', () => {
      let user: GetUserOutput;
      beforeEach(async () => {
        user = await controller.findOne({ id: getUserStub().id });
      });
      test('then it should call userService', () => {
        expect(userService.findOne).toHaveBeenCalled();
      })
      test('then it should return a user', () => {
        expect(user.ok).toEqual(true);
        expect(user.error).toEqual(undefined);
        expect(user.user).toEqual(getUserStub());
      })

    })

  })

  describe('update()', () => {
    describe('when update is called', () => {
      let updateUserOutput: UpdateUserOutput;
      let user: User = userModelStub();
      beforeEach(async () => {
        updateUserOutput = await controller.update({ name: "Updated" }, user);
      });
      test('then it should call userService', () => {
        expect(userService.update).toHaveBeenCalled();
      })
      test('then it should return an updated user', () => {
        expect(updateUserOutput.ok).toEqual(true);
        expect(updateUserOutput.error).toEqual(undefined);
        expect(updateUserOutput.user).toEqual(getUserStub());
      })

    })
  });

  describe('changePassword()', () => {
    describe('when changePassword is called', () => {
      let deleteUserOutput: DeleteUserOutput;
      let user: User = userModelStub();
      let changePasswordDto: ChangePasswordInput = {
        oldPassword: "1212",
        newPassword: "1212",
      }
      beforeEach(async () => {
        deleteUserOutput = await controller.changePassword(changePasswordDto, user);
      });
      test('then it should call userService', () => {
        expect(userService.changePassword).toHaveBeenCalled();
      })
      test('then it should true for delete success.', () => {
        expect(deleteUserOutput.ok).toEqual(true);
        expect(deleteUserOutput.error).toEqual(undefined);
      })

    })

  })

  describe('deleteAccount()', () => {
    describe('when deleteAccount is called', () => {
      let deleteUserOutput: DeleteUserOutput;
      let user: User = userModelStub();
      beforeEach(async () => {
        deleteUserOutput = await controller.deleteAccount(user);
      });
      test('then it should call userService', () => {
        expect(userService.deleteAccount).toHaveBeenCalled();
      })
      test('then it should true for delete success.', () => {
        expect(deleteUserOutput.ok).toEqual(true);
        expect(deleteUserOutput.error).toEqual(undefined);
      })

    })

  })

});
