import { getUserStub } from "../test/stubs/user.stub";

export const UserService = jest.fn().mockReturnValue({
    register: jest.fn().mockReturnValue({ ok: true }),
    login: jest.fn().mockReturnValue({
        ok: true,
        user: getUserStub(),
        token: "asdfkjk",
    }),
    findAll: jest.fn().mockReturnValue({
        ok: true,
        users: [getUserStub()]
    }),
    findOne: jest.fn().mockReturnValue({
        ok: true,
        user: getUserStub(),
    }),
    update: jest.fn().mockReturnValue({
        ok: true,
        user: getUserStub(),
    }),
    changePassword: jest.fn().mockReturnValue({ ok: true }),
    myProfile: jest.fn().mockReturnValue({
        ok: true,
        user: getUserStub(),
    }),
    deleteAccount: jest.fn().mockReturnValue({ ok: true }),
})