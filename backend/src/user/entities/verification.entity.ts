import { CoreEntity } from "../../common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { v4 as uuid } from "uuid";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType('VerificationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {

    @Field(() => String)
    @IsString()
    @Column()
    code: string;

    @Field(() => User)
    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode (): void {
        this.code = uuid() + Date.now();
    }
}