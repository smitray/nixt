import { PrimaryKey, Property, SerializedPrimaryKey } from 'mikro-orm';
import { ObjectId } from '@mikro-orm/mongodb';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export default abstract class BaseEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Field(() => ID)
  @SerializedPrimaryKey()
  id!: string;

  @Field(() => Date)
  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
