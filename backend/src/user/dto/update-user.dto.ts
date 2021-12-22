import { Field, InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from '../../common/dtos/core.output';
import { User } from '../entities/user.entity';
import { CreateUserInput } from './create-user.dto';

@InputType()
export class UpdateUserInput extends PartialType(OmitType(CreateUserInput, ['password'])) {
    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    bio?: string;
}

@ObjectType()
export class UpdateUserOutput extends CoreOutput {
    @Field(() => User, { nullable: true })
    user?: User;
}