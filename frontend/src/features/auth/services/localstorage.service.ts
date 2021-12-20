import { TOKEN_CONSTANT, USER_CONSTANT } from "../constants";
import { IUser } from "../types/user.type";

export function saveToken (token: string) {
    localStorage.setItem(TOKEN_CONSTANT, token);
}

export function getToken () {
    return localStorage.getItem(TOKEN_CONSTANT);
}
export function removeToken () {
    return localStorage.removeItem(TOKEN_CONSTANT);
}

export function saveUser (user: IUser) {
    localStorage.setItem(USER_CONSTANT, JSON.stringify(user));
}

export function getUser () {
    return localStorage.getItem(USER_CONSTANT);
}
export function removeUser () {
    return localStorage.removeItem(USER_CONSTANT);
}