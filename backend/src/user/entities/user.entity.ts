import { InternalServerErrorException } from "@nestjs/common";
import { Type } from "class-transformer";
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import {
    Field,
    InputType,
    ObjectType,
    registerEnumType,
} from "@nestjs/graphql";
import { Review } from "../../product/entities/review.entity";
import { Address } from "../../profile/entities/address.entity";
import { Product, ProductEntry } from "../../product/entities/product.entity";
import { Order } from "../../order/entities/order.entity";

export enum UserRole {
    User = "User",
    Admin = "Admin",
}

registerEnumType(UserRole, { name: "UserRole" });

@InputType("UserInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(() => String)
    @Column({ unique: true, nullable: false })
    @IsString()
    @Type(() => String)
    username: string;

    @Field(() => String)
    @Column({ nullable: false })
    @IsString()
    @Type(() => String)
    name: string;

    @Field(() => String)
    @Column({ select: false })
    @IsString()
    @MinLength(6)
    @Type(() => String)
    password: string;

    @Field(() => String)
    @Column({ unique: true })
    @IsEmail()
    @Type(() => String)
    email: string;

    @Field(() => UserRole)
    @Column({ type: "enum", enum: UserRole, default: UserRole.User })
    @IsEnum(UserRole)
    role: UserRole;

    @Field(() => Boolean, { defaultValue: false })
    @Column({ default: false })
    @Type((type) => Boolean)
    @IsBoolean()
    verified: boolean;

    @Field(() => Boolean, { defaultValue: false })
    @Column({ default: false })
    @Type(() => Boolean)
    @IsBoolean()
    disabled: boolean;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @Type(() => String)
    bio?: string;

    @Field(() => [Review])
    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @ManyToMany(() => Product)
    @JoinTable()
    wishlists: Product[];

    @Field(() => [Address], { nullable: true })
    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @Field(() => [ProductEntry])
    @OneToMany(() => ProductEntry, (productEntry) => productEntry.user)
    entries: ProductEntry[];

    @Field(() => [Order])
    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];

    @BeforeInsert()
    async createUsername () {
        if (this.name) {
            this.username = `${this.name
                .toLocaleLowerCase()
                .replace(/ /g, "")}${Date.now()}`;
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword (): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (e) {
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword (aPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(aPassword, this.password);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}
