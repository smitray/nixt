import { ArgsType, Field } from 'type-graphql';
import { Matches, MinLength } from 'class-validator';

@ArgsType()
export default class CreateUserDTO {
  @Field()
  @Matches(/^\S*$/, { message: 'First name must not include spaces' })
  @MinLength(3, { message: 'Name is too short' })
  firstName: string;

  @Field()
  @Matches(/^\S*$/, { message: 'Last name must not include spaces' })
  lastName: string;
}
