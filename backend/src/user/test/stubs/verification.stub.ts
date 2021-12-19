import { User } from "src/user/entities/user.entity";
import { Verification } from "src/user/entities/verification.entity";

export const getVerificationStub = (): Verification => {
    return {
        id: 1,
        code: '12',
        user: { id: 1 } as User,
        updatedAt: new Date(),
        createdAt: new Date(),
        createCode: () => { }
    }
}