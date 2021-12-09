import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { CoreOutput } from "src/common/dtos/core.output";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./product.entity";

@ObjectType()
@InputType()
@Entity()
export class Category extends CoreEntity {
    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @OneToMany(() => Category, category => category.parent)
    children: Category[];

    @ManyToOne(() => Category, category => category.children)
    parent: Category;
}
