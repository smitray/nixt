import { MikroORM, EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';

/* INJECT_IMPORT */
import User from '@module/User/user.entity';
import Account from '@module/Account/account.entity';

const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  /* INJECT_DI */
  UserRepository: EntityRepository<User>;
  AccountRepository: EntityRepository<Account>;
};

export default DI;
