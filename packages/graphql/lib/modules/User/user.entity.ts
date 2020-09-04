import { Entity, Property, OneToOne } from 'mikro-orm';
import { ObjectType, Field } from 'type-graphql';
import BaseEntity from '@util/entity/base.entity';
import Account from '@module/Account/account.entity';

@ObjectType()
@Entity({ tableName: 'users' })
export default class User extends BaseEntity {
  @Field()
  @Property()
  firstName!: string;

  @Field()
  @Property()
  lastName!: string;

  @Field()
  name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Field(() => Account)
  @OneToOne()
  account: Account;

  constructor(account: Account) {
    super();
    this.account = account;
  }
}
