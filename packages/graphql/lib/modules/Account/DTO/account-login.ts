import { ArgsType, Field } from 'type-graphql';
import { Length, Matches, IsEmail } from 'class-validator';

@ArgsType()
export default class LoginDTO {
  @Field({ nullable: true })
  @Length(5, 15)
  @Matches(/^\S*$/, { message: 'Username must not include spaces' })
  username?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
