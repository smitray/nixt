import { Entity, Property, Unique } from 'mikro-orm';
import { ObjectType, Field } from 'type-graphql';
import BaseEntity from '@util/entity/base.entity';

@ObjectType()
@Entity({ tableName: 'accounts' })
export default class Account extends BaseEntity {
  @Field()
  @Property()
  @Unique()
  username!: string;

  @Property({ hidden: true })
  password: string;

  @Field()
  @Property()
  @Unique()
  email: string;
}
