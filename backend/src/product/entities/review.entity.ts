import { Field, Float, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@ObjectType()
@InputType()
@Entity()
export class Review extends CoreEntity {
    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    content: string;

    @Column({ type: Number },)
    @IsString()
    @Field(() => Float)
    rating: string;

    @ManyToOne(() => User, user => user.reviews)
    user: User;

    @ManyToOne(() => Product, product => product.reviews)
    product: Product;
}
