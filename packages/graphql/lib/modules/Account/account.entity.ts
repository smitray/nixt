import { Entity, Property, Unique, Enum } from 'mikro-orm';
import { ObjectType, Field, Int } from 'type-graphql';
import BaseEntity from '@util/entity/base.entity';
import { Role, Status } from './account.dto';

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

  @Field(() => Int, { nullable: true })
  @Property({ nullable: true })
  phone?: number;

  @Field()
  token: string;
}
