import { ArgsType, Field } from 'type-graphql';
import { Length, Matches, IsEmail, IsInt } from 'class-validator';

@ArgsType()
export default class UpdateAccountDTO {
  @Field({ nullable: true })
  @Length(5, 15)
  @Matches(/^\S*$/, { message: 'Username must not include spaces' })
  username: string;

  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsInt()
  phone: number;
}
