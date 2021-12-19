import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '..//jwt/jwt.service';
import { UserService } from '..//user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async canActivate (context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const restToken = request && request.headers['x-jwt'];
        const gqlToken = gqlContext.token;
        const token = gqlToken || restToken;
        if (token) {
            try {
                const decodedToken = this.jwtService.verify(token);
                if (
                    typeof decodedToken === 'object' &&
                    decodedToken.hasOwnProperty('id')
                ) {
                    const { user } = await this.userService.findOne({
                        id: decodedToken.id,
                    });
                    if (!user) {
                        return false;
                    }
                    gqlContext['user'] = user;
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                return false;
            }
        }
        return false;
    }
}
