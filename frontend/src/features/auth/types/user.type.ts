export interface IUser {
    username: string;
    name: string;
    password: string;

    email: string;

    role: UserRole;

    bio: string;

    picture: string;

    reviews: [];

    wishlists: [];

    addresses: [];

    products: [];

    orders: [];
}

export enum UserRole {
    User = "User",
    Admin = "Admin",
}