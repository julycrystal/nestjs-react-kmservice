import { User, UserRole } from "../../../user/entities/user.entity";

export const getUserStub = () => {
    return {
        "id": 2,
        "createdAt": new Date("2021-11-06T10:31:25.444Z"),
        "updatedAt": new Date("2021-11-06T14:47:53.081Z"),
        "username": "kaungmyat1636194685444",
        "name": "Something updated",
        "email": "kokaung@gmail.com",
        "password": "1212",
        "role": UserRole.User,
    } as User;
}

export const userModelStub = () => {
    return {
        "id": 2,
        "createdAt": new Date("2021-11-06T10:31:25.444Z"),
        "updatedAt": new Date("2021-11-06T14:47:53.081Z"),
        "username": "kaungmyat1636194685444",
        "name": "Something updated",
        "email": "kokaung@gmail.com",
        verified: false,
        posts: [],
        "role": UserRole.User,
        password: "",
        createUsername: async () => { },
        checkPassword: async () => { return true; },
        hashPassword: async () => { },
        comments: [],
        bio: "",
    } as User;
}