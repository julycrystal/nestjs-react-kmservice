import {
  ObjectType,
  Field,
  Float,
  InputType,
  Int,
  registerEnumType,
} from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { User } from "../../user/entities/user.entity";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./category.entity";
import { Review } from "./review.entity";

export enum ProductStatus {
  SOLDOUT = "SOLDOUT",
  INSTOCK = "INSTOCK",
}

registerEnumType(ProductStatus, { name: "ProductStatus" });

@InputType("ProductInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Product extends CoreEntity {

  @Field(() => String)
  @Type(() => String)
  @Column({ type: String })
  @IsString()
  title: string;

  @Field(() => String)
  @Column({ type: String })
  @IsString()
  description: string;

  @Column({ type: String, nullable: false, unique: true })
  @Field(() => String)
  slug: string;

  @Column({ type: String, nullable: true })
  @Field(() => String)
  coverImage: string;

  @Field(() => [ProductImageItem])
  @OneToMany(() => ProductImageItem, (productItem) => productItem.product, { onDelete: 'CASCADE' })
  images: ProductImageItem[];

  @Field(() => Float)
  @Column({ type: Number, nullable: false })
  @IsNumber()
  @Min(1)
  price: number;

  @Field(() => Int)
  @Column({ type: Number, nullable: false, default: 0 })
  @IsNumber()
  views: number;

  @Field(() => Int)
  @Column({ type: Number, nullable: false, default: 0 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @Column({ type: Number, nullable: false })
  @IsNumber()
  @Max(99)
  discount: number;

  @Field(() => Boolean)
  @IsNotEmpty()
  @Column({ type: Boolean, default: false })
  showRemaining: boolean;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: "SET NULL",
  })
  category: Category;

  @OneToMany(() => Review, (review) => review.product, { onDelete: 'CASCADE' })
  reviews: Review[];

  @BeforeInsert()
  async createSlug () {
    if (this.title) {
      this.slug = `${this.title
        .toLocaleLowerCase()
        .replace(/ /g, "")}${Date.now()}`;
    }
  }
}

@ObjectType()
@Entity()
@InputType("ProductImageItemInputType", { isAbstract: true })
export class ProductImageItem extends CoreEntity {
  @Column({ type: String })
  @Field(() => String)
  @IsString()
  imageUrl: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: "CASCADE",
  })
  product: Product;
}

@InputType("ProductEntryInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class ProductEntry extends CoreEntity {

  @Field(() => Date)
  @CreateDateColumn({ select: true })
  @Type(() => Date)
  entryDate: Date;

  @Field(() => Int)
  @Column({ type: Number, nullable: false })
  @IsNumber()
  @Min(1)
  amount: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.entries)
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: "CASCADE",
  })
  product: Product;
}
