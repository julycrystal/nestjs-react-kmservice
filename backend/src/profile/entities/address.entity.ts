import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@InputType("AddressInput", { isAbstract: true })
@ObjectType()
@Entity()
export class Address extends CoreEntity {

    @Field(() => String)
    @Type(() => String)
    @Column({ type: String })
    @IsString()
    name: string;

    @Column({ type: String, nullable: true },)
    @IsString()
    @Field(() => String, { nullable: true },)
    city: string;

    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    address: string;

    @Column({ type: String, nullable: true },)
    @IsOptional()
    @IsString()
    @Field(() => String, { nullable: true },)
    apartment: string;

    @Column({ type: String },)
    @IsString()
    @Field(() => String)
    country: string;

    @Column({ type: String, nullable: true },)
    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    note: string;

    @ManyToOne(() => User, user => user.addresses)
    user: User;
}
