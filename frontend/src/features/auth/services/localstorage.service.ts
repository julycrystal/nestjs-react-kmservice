import { TOKEN_CONSTANT, USER_CONSTANT } from "../constants";

export function saveToken (token: string) {
    localStorage.setItem(TOKEN_CONSTANT, token);
}

export function getToken () {
    return localStorage.getItem(TOKEN_CONSTANT);
}
export function removeToken () {
    return localStorage.removeItem(TOKEN_CONSTANT);
}

export function getUser () {
    return localStorage.getItem(USER_CONSTANT);
}