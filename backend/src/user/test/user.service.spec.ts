import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { MockPostRepository } from '../../post/__mocks__/post.repository';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '../../jwt/jwt.service';
import { CreateUserInput, CreateUserOutput } from '../dto/create-user.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { getUserStub } from './stubs/user.stub';
import { Verification } from '../entities/verification.entity';
import { MockVerificationRepository } from '../__mocks__/verification.repository';
import { MockUserRepoitory } from '../__mocks__/user.repository';
import { GetUsersOutput } from '../dto/get-users.dto';
import { GetUserOutput } from '../dto/get-user.dto';
import { UpdateUserInput as ChangePasswordInput, UpdateUserOutput } from '../dto/update-user.dto';
import { ChangePasswordInput, changePasswordOutput } from '../dto/change-password.dto';
import { MyProfileOutput } from '../dto/my-profile.dto';
import { DeleteUserOutput } from '../dto/delete-user.dto';
import { VerifyEmailOutput } from '../dto/verify-email.dto';
import { getVerificationStub } from './stubs/verification.stub';

const mockJwtService = () => ({
  sign: jest.fn(() => "signed-token-baby"),
  verify: jest.fn(),
});


type MockRepoitory<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepoitory<User>;
  let verificationRepository: MockRepoitory<Verification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: MockUserRepoitory,
        },
        {
          provide: getRepositoryToken(Post),
          useValue: MockPostRepository,
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: MockVerificationRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },


      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  });

  describe("register()", () => {
    let createUserOutput: CreateUserOutput;
    let createUserDto: CreateUserInput = {
      email: getUserStub().email,
      name: getUserStub().name,
      password: "111111",
    }
    describe('when register is called', () => {

      it("should create a new user", async () => {
        createUserOutput = await service.register(createUserDto);
        expect(createUserOutput.ok).toEqual(true);
        expect(createUserOutput.error).toEqual(undefined);

        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
        expect(userRepository.save).toHaveBeenCalledTimes(1);

        expect(verificationRepository.create).toHaveBeenCalledTimes(1);
        expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      })

      it('should fail on error when creating user.', async () => {
        userRepository.create.mockRejectedValueOnce(new Error(''))
        createUserOutput = await service.register(createUserDto);

        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);

        expect(createUserOutput.ok).toEqual(false);
        expect(createUserOutput.error).not.toEqual(undefined);
        expect(createUserOutput.error).toEqual("Cannot create user.");
      })

      it('should fail when duplicate record found.', async () => {
        userRepository.create.mockRejectedValueOnce(new QueryFailedError('', [], { code: "23505" }))
        try {
          createUserOutput = await service.register(createUserDto);
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.status).toEqual(400);
          expect(error.message).toEqual(`User with this email already exists.`);
        }
      })
    })
  });

  describe("login()", () => {
    let loginOutput: LoginOutput;
    let loginDto: LoginInput = {
      email: "arkar@gmail.com",
      password: "111111"
    };
    describe('when login() is called', () => {

      it('should fail on error when user do not exists.', async () => {
        userRepository.findOne.mockResolvedValueOnce(null);
        try {
          loginOutput = await service.login(loginDto);
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.status).toEqual(400);
          expect(error.message).toEqual(`Invalid email / password.`);
        }
      })

      it('should fail on error when email is not verified.', async () => {
        userRepository.findOne.mockResolvedValueOnce({ ...getUserStub(), verified: false });
        try {
          loginOutput = await service.login(loginDto);
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.status).toEqual(400);
          expect(error.message).toEqual(`You need to verify your email first.`);
        }
      })

      it('should fail with incorrect password.', async () => {
        userRepository.findOne.mockResolvedValue({
          ...getUserStub(),
          verified: true,
          checkPassword: jest.fn(() => Promise.resolve(false))
        });
        try {
          await service.login(loginDto);
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(error.status).toEqual(400);
          expect(error.message).toEqual(`Incorrect Password`);
        }
      })

      it('should fail on error.', async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error(''));
        loginOutput = await service.login(loginDto);
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);

        expect(loginOutput.ok).toEqual(false);
        expect(loginOutput.error).toEqual('Login Failed.');
        expect(loginOutput.token).toBeUndefined();
        expect(loginOutput.user).toBeUndefined();
      })

      it('should return user and token on success.', async () => {
        userRepository.findOne.mockResolvedValue({ ...getUserStub(), verified: true, checkPassword: () => jest.fn().mockResolvedValueOnce(true) });
        loginOutput = await service.login(loginDto);
        expect(userRepository.findOne).toHaveBeenCalledTimes(2);

        expect(loginOutput.ok).toEqual(true);
        expect(loginOutput.error).toBeUndefined();
        expect(loginOutput.token).toEqual(expect.any(String));
        expect(loginOutput.user).toBeDefined();
      })

    })

  });

  describe("findAll()", () => {
    describe('when findAll() is call', () => {
      let getUsersOutput: GetUsersOutput;
      it("should return all users", async () => {
        userRepository.find.mockResolvedValueOnce([getUserStub()]);
        getUsersOutput = await service.findAll();

        expect(userRepository.find).toHaveBeenCalledTimes(1);

        expect(getUsersOutput.users).toHaveLength(1);
        expect(getUsersOutput.users).toEqual([getUserStub()]);
        expect(getUsersOutput.ok).toEqual(true);
        expect(getUsersOutput.error).toBeUndefined();
      })
      it('should fail on error.', async () => {
        userRepository.find.mockRejectedValueOnce(new Error(''));
        getUsersOutput = await service.findAll();
        expect(userRepository.find).toHaveBeenCalledTimes(1);

        expect(getUsersOutput.ok).toEqual(false);
        expect(getUsersOutput.error).toEqual('Cannot get all users.');
        expect(getUsersOutput.users).toBeUndefined();
      })
    })

  });

  describe("findOne()", () => {

    describe('when findOne() is called ', () => {

      let getUserOutput: GetUserOutput;

      beforeEach(() => {
        getUserOutput = null;
        jest.resetAllMocks();
      })

      it("should return a user", async () => {
        userRepository.findOne.mockResolvedValueOnce(getUserStub());
        getUserOutput = await service.findOne({ id: 1 });

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

        expect(getUserOutput.user).toEqual(getUserStub());
        expect(getUserOutput.ok).toEqual(true);
        expect(getUserOutput.error).toBeUndefined();
      })

      it('should fail on error.', async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error(''));
        getUserOutput = await service.findOne({ id: 1 });
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

        expect(getUserOutput.ok).toEqual(false);
        expect(getUserOutput.error).toEqual('Cannot get user.');
        expect(getUserOutput.user).toBeUndefined();
      })

      it('should throw 404 when user is not found.', async () => {
        userRepository.findOne.mockResolvedValueOnce(null);
        getUserOutput = null;
        try {
          getUserOutput = await service.findOne({ id: 1 });
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

          expect(error.name).toEqual("HttpException");
          expect(error.status).toEqual(404);
        }
      })
    })

  });

  describe("update()", () => {
    let updateUserOutput: UpdateUserOutput;

    const updateUserDto: ChangePasswordInput = {
      name: "KMh",
      email: "asd@gmail.com",
    }
    describe('when update() is called ', () => {

      beforeEach(() => {
        updateUserOutput = null;
        jest.resetAllMocks();
      })

      it("should return a user", async () => {
        userRepository.findOne.mockResolvedValue(getUserStub());
        updateUserOutput = await service.update(updateUserDto, getUserStub() as User);

        expect(userRepository.findOne).toHaveBeenCalledTimes(2);
        expect(userRepository.save).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 2 });

        expect(verificationRepository.delete).toHaveBeenCalledTimes(1)
        expect(verificationRepository.save).toHaveBeenCalledTimes(1)
        expect(verificationRepository.create).toHaveBeenCalledTimes(1)

        expect(updateUserOutput.user.email).toEqual(updateUserDto.email);
        expect(updateUserOutput.user.name).toEqual(updateUserDto.name);
        expect(updateUserOutput.user.verified).toEqual(false);
        expect(updateUserOutput.ok).toEqual(true);
        expect(updateUserOutput.error).toBeUndefined();
      })

      it('should fail on error.', async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error(''));
        updateUserOutput = await service.update(updateUserDto, getUserStub() as User);

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 2 });

        expect(updateUserOutput.ok).toEqual(false);
        expect(updateUserOutput.error).toEqual('Cannot update users.');
        expect(updateUserOutput.user).toBeUndefined();
      })

      it('should throw 404 when user is not found.', async () => {
        userRepository.findOne.mockResolvedValueOnce(null);
        updateUserOutput = null;
        try {
          updateUserOutput = await service.update(updateUserDto, getUserStub() as User);
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userRepository.findOne).toHaveBeenCalledWith({ id: 2 });

          expect(error.name).toEqual("HttpException");
          expect(error.status).toEqual(404);
        }
      })
    })


  });

  describe("changePassword()", () => {
    let changePasswordOutput: changePasswordOutput;

    // () => Promise.resolve(true)
    const changePasswordDto: ChangePasswordInput = {
      oldPassword: "",
      newPassword: "a",
    }
    describe('when changePassword() is called ', () => {

      beforeEach(() => {
        changePasswordOutput = null;
        jest.resetAllMocks();
      })

      it("should return a user", async () => {
        let user: User = {
          ...getUserStub(),
          verified: false,
          posts: [],
          comments: [],
          createUsername: async () => { },
          hashPassword: async () => { },
          checkPassword: jest.fn().mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false)
            .mockReturnValue(true),
        }
        userRepository.findOne.mockResolvedValue(user);
        changePasswordOutput = await service.changePassword(
          changePasswordDto,
          user,
        );
        expect(userRepository.findOne).toHaveBeenCalledTimes(2);
        expect(userRepository.save).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 2 });

        expect(changePasswordOutput.ok).toEqual(true);
        expect(changePasswordOutput.error).toBeUndefined();
      })

      it("should fail on incorrect password a user", async () => {
        let user: User = {
          ...getUserStub(),
          verified: false,
          posts: [],
          comments: [],
          createUsername: async () => { },
          hashPassword: async () => { },
          checkPassword: jest.fn().mockResolvedValueOnce(false)
        }
        userRepository.findOne.mockResolvedValue(user);
        try {
          changePasswordOutput = await service.changePassword(
            changePasswordDto,
            user,
          );
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);

          expect(error.message).toEqual("Incorrect Password");
          expect(error.name).toEqual("HttpException");
          expect(error.status).toEqual(400);
        }
      })

      it("should fail on old password is same with new password", async () => {
        let user: User = {
          ...getUserStub(),
          verified: false,
          posts: [],
          comments: [],
          createUsername: async () => { },
          hashPassword: async () => { },
          checkPassword: jest.fn().mockResolvedValueOnce(true)
            .mockResolvedValueOnce(true)
        }
        userRepository.findOne.mockResolvedValue(user);
        try {
          changePasswordOutput = await service.changePassword(
            changePasswordDto,
            user,
          );
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(error.message).toEqual("New password can\'t be same with old password");
          expect(error.name).toEqual("HttpException");
          expect(error.status).toEqual(400);
        }
      })

      it('should fail on error.', async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error(''));
        changePasswordOutput = await service.changePassword(changePasswordDto, getUserStub() as User);

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);

        expect(changePasswordOutput.ok).toEqual(false);
        expect(changePasswordOutput.error).toEqual('Cannot change password.');
      })

      it('should throw 404 when user is not found.', async () => {
        userRepository.findOne.mockResolvedValueOnce(null);
        changePasswordOutput = null;
        try {
          changePasswordOutput = await service.changePassword(changePasswordDto, getUserStub() as User);
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);

          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("User not found.");
          expect(error.status).toEqual(404);
        }
      })
    })


  });

  describe("myProfile()", () => {

    describe('when myProfile() is called ', () => {

      let myProfileOutput: MyProfileOutput;

      beforeEach(() => {
        myProfileOutput = null;
        jest.resetAllMocks();
      })

      it("should return a user", async () => {
        userRepository.findOne.mockResolvedValueOnce(getUserStub());
        myProfileOutput = await service.myProfile({ id: 1 } as User);

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

        expect(myProfileOutput.user).toEqual(getUserStub());
        expect(myProfileOutput.ok).toEqual(true);
        expect(myProfileOutput.error).toBeUndefined();
      })

      it('should fail on error.', async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error(''));
        myProfileOutput = await service.myProfile({ id: 1 } as User);
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

        expect(myProfileOutput.ok).toEqual(false);
        expect(myProfileOutput.error).toEqual('Cannot get user.');
        expect(myProfileOutput.user).toBeUndefined();
      })

      it('should throw 404 when user is not found.', async () => {
        userRepository.findOne.mockResolvedValueOnce(null);
        myProfileOutput = null;
        try {
          myProfileOutput = await service.myProfile({ id: 1 } as User);
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

          expect(error.name).toEqual("HttpException");
          expect(error.status).toEqual(404);
        }
      })
    })

  });

  describe("deleteAccount()", () => {

    describe('when deleteAccount() is called ', () => {

      let verifyEmailOutput: VerifyEmailOutput;

      beforeEach(() => {
        verifyEmailOutput = null;
        jest.resetAllMocks();
      })

      it("should return true if confirmation success.", async () => {
        userRepository.findOne.mockResolvedValueOnce(getUserStub());
        verifyEmailOutput = await service.deleteAccount({ id: 1 } as User);

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

        expect(userRepository.delete).toHaveBeenCalledTimes(1);
        expect(userRepository.delete).toHaveBeenCalledWith({ id: 1 });

        expect(verifyEmailOutput.ok).toEqual(true);
        expect(verifyEmailOutput.error).toBeUndefined();
      })

      it('should fail on error.', async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error(''));
        verifyEmailOutput = await service.deleteAccount({ id: 1 } as User);
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

        expect(verifyEmailOutput.ok).toEqual(false);
        expect(verifyEmailOutput.error).toEqual('Cannot delete users.');
      })

      it('should throw 404 when user is not found.', async () => {
        userRepository.findOne.mockResolvedValueOnce(null);
        verifyEmailOutput = null;
        try {
          verifyEmailOutput = await service.deleteAccount({ id: 1 } as User);
        } catch (error) {
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

          expect(error.name).toEqual("HttpException");
          expect(error.status).toEqual(404);
        }
      })
    })
  });

  describe("verifyEmail()", () => {

    describe('when verifyEmail() is called ', () => {

      let verifyEmailOutput: VerifyEmailOutput;

      beforeEach(() => {
        verifyEmailOutput = null;
        jest.resetAllMocks();
      })

      it("should return true on delete success.", async () => {
        verificationRepository.findOne.mockResolvedValueOnce(getVerificationStub())
        userRepository.findOne.mockResolvedValueOnce(getUserStub());
        verifyEmailOutput = await service.verifyEmail({ code: "1" });


        expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({ id: 1 });

        expect(verificationRepository.delete).toHaveBeenCalledTimes(1);
        expect(verificationRepository.delete).toHaveBeenCalledWith({ user: { id: 2 } });

        expect(userRepository.save).toHaveBeenCalledTimes(1);

        expect(verifyEmailOutput.ok).toEqual(true);
        expect(verifyEmailOutput.error).toBeUndefined();
      })

      it('should fail on error.', async () => {
        verificationRepository.findOne.mockRejectedValueOnce(new Error())
        userRepository.findOne.mockResolvedValueOnce(getUserStub());
        verifyEmailOutput = await service.verifyEmail({ code: "1" });

        expect(verifyEmailOutput.ok).toEqual(false);
        expect(verifyEmailOutput.error).toEqual('Email Verification Failed');
      })

      it('should throw 404 when user is not found.', async () => {
        verificationRepository.findOne.mockResolvedValueOnce(null);
        verifyEmailOutput = null;
        try {
          verifyEmailOutput = await service.verifyEmail({ code: "1" });
        } catch (error) {
          expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException");
          expect(error.status).toEqual(400);
        }
      })
    })
  });
});
