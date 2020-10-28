import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import DI from '@DI';
import cfg from '@nixt/config';
/* INJECT_IMPORT */
import User from '@module/User/user.entity';
import Account from '@module/Account/account.entity';

export default async (clientUrl: string): Promise<void> => {
  try {
    const orm = await MikroORM.init({
      type: 'mongo',
      clientUrl,
      dbName: cfg.mongodb.db,
      ensureIndexes: true,
      entities: [
        'dist/utils/entity/*.entity.js',
        'dist/modules/**/*.entity.js',
      ],
      entitiesTs: [
        'lib/utils/entity/*.entity.ts',
        'lib/modules/**/*.entity.ts',
      ],
      metadataProvider: ReflectMetadataProvider,
    });
    DI.orm = orm;
    DI.em = orm.em;
    /* INJECT_DI */
    DI.UserRepository = orm.em.getRepository(User);
    DI.AccountRepository = orm.em.getRepository(Account);
  } catch (error) {
    throw new Error(error);
  }
};

export const dropDB = (): void => {
  /* INJECT_NATIVE_DELETE */
  DI.UserRepository.nativeDelete({});
  DI.AccountRepository.nativeDelete({});
};
