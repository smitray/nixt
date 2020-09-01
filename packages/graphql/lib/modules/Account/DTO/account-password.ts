import { ArgsType, Field } from 'type-graphql';
import { Length, Matches } from 'class-validator';

@ArgsType()
export default class AccountPasswordDTO {
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
