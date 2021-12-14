import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./product.entity";

@InputType({ isAbstract: true, })
@ObjectType()
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
