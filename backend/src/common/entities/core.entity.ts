import { CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Type } from 'class-transformer';
import { IsNumber } from "class-validator";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType({ isAbstract: true })
export class CoreEntity {

    @PrimaryGeneratedColumn()
    @Index()
    @Type(() => Number)
    @Field(() => Number)
    @IsNumber()
    id: number;

    @Field(() => Date)
    @CreateDateColumn({ select: true })
    @Type(() => Date)
    createdAt: Date;

    @Type(() => Date)
    @UpdateDateColumn({ select: false })
    @Field(() => Date)
    updatedAt: Date;

}