import { ArgsType, Field, registerEnumType } from 'type-graphql';
import { Length, Matches, IsEmail, IsInt } from 'class-validator';

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

  @Field(() => Role, { defaultValue: 'user' })
  role: Role;

  @Field(() => Status, { defaultValue: 'unverified' })
  status: Status;

  @Field({ nullable: true })
  @IsInt()
  phone: number;
}

@ArgsType()
export class UpdateAccountDTO {
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

@ArgsType()
export class LoginDTO {
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
