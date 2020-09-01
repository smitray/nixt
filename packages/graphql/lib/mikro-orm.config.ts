import { Options, MikroORM, EntityManager } from 'mikro-orm';
import cfg from '@nixt/config';
import { EntityRepository } from '@mikro-orm/mongodb';
/* INJECT_IMPORT */
import Account from '@module/Account/account.entity';

const mongoAuth = process.env.MONGO_USER
  ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@`
  : '';
const clientUrl = `mongodb://${mongoAuth}${cfg.host}:${cfg.mongodb.mongoPort}`;

const config: Options = {
  type: 'mongo',
  clientUrl,
  dbName: cfg.mongodb.db,
  ensureIndexes: true,
  entities: ['dist/utils/entity/*.entity.js', 'dist/modules/**/*.entity.js'],
  entitiesTs: ['lib/utils/entity/*.entity.ts', 'lib/modules/**/*.entity.ts'],
};

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  /* INJECT_DI */
  AccountRepository: EntityRepository<Account>;
};

export default config;
