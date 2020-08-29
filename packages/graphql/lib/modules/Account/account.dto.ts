import { ArgsType, Field } from 'type-graphql';
import { Length, Matches, IsEmail } from 'class-validator';

@ArgsType()
export class AccountPasswordDTO {
  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  confirm: string;
}

@ArgsType()
export class CreateAccountDTO extends AccountPasswordDTO {
  @Field()
  @Length(5, 15)
  @Matches(/^\S*$/, { message: 'Username must not include spaces' })
  username: string;

  @Field()
  @IsEmail()
  email: string;
}
