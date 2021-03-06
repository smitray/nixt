import { Entity, Property, Unique, Enum } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';
import BaseEntity from '@util/entity/base.entity';
import { Role, Status } from './dto/create-account';

@ObjectType()
@Entity({ tableName: 'accounts' })
export default class Account extends BaseEntity {
  @Field()
  @Property()
  @Unique()
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Field()
  @Enum(() => Role)
  role: Role;

  @Field()
  @Enum(() => Status)
  status: Status;

  @Field()
  @Property()
  @Unique()
  email: string;

  @Field({ nullable: true })
  @Property()
  phone?: number;

  @Field()
  token: string;
}
