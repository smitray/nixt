import { registerEnumType, ArgsType, Field } from 'type-graphql';
import { Length, Matches, IsEmail, IsInt } from 'class-validator';
import AccountPasswordDTO from './account-password';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum Status {
  Verified = 'verified',
  Unverified = 'unverified',
  Active = 'active',
  Locked = 'locked',
}

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(Status, {
  name: 'Status',
});

@ArgsType()
export default class CreateAccountDTO extends AccountPasswordDTO {
  @Field()
  @Length(5, 15)
  @Matches(/^\S*$/, { message: 'Username must not include spaces' })
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => Role, { defaultValue: 'user' })
  role: Role;

  @Field(() => Status, { defaultValue: 'unverified' })
  status: Status;

  @Field({ nullable: true })
  @IsInt()
  phone: number;
}
