import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/order/entities/order.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@InputType("AddressInput", { isAbstract: true })
@ObjectType()
@Entity()
export class Address extends CoreEntity {

    @Field(() => String)
    @Type(() => String)
    @Column({ type: String })
    @IsString()
    name: string;

    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    company: string;

    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    address: string;

    @Column({ type: String, nullable: true },)
    @IsOptional()
    @Field(() => String)
    apartment: string;

    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    region: string;

    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    country: string;

    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    phone: string;

    @ManyToOne(() => User, user => user.addresses)
    user: User;
}
