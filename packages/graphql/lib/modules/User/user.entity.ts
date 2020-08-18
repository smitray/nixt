import bcrypt from 'bcryptjs';
import { Entity, Property, Unique } from 'mikro-orm';
import BaseEntity from '../../utils/entity/base.entity';

@Entity({ tableName: 'users' })
export default class User extends BaseEntity {
  @Property()
  @Unique()
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = User.hashPassword(password);
  }

  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  // validatePassword(password: string) {
  //   return bcrypt.compare(password, this.password);
  // }
}
