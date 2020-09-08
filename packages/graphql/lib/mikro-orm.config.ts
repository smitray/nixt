import {
  Options,
  MikroORM,
  EntityManager,
  ReflectMetadataProvider,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import cfg from '@nixt/config';
/* INJECT_IMPORT */
import User from '@module/User/user.entity';
import Account from '@module/Account/account.entity';

const mongoAuth = process.env.MONGO_USER
  ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@`
  : '';
const clientUrl = `mongodb://${mongoAuth}${cfg.host}:${cfg.mongodb.mongoPort}`;

export const config: Options = {
  type: 'mongo',
  clientUrl,
  dbName: cfg.mongodb.db,
  ensureIndexes: true,
  entities: ['dist/utils/entity/*.entity.js', 'dist/modules/**/*.entity.js'],
  entitiesTs: ['lib/utils/entity/*.entity.ts', 'lib/modules/**/*.entity.ts'],
  metadataProvider: ReflectMetadataProvider,
};

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  /* INJECT_DI */
  UserRepository: EntityRepository<User>;
  AccountRepository: EntityRepository<Account>;
};
