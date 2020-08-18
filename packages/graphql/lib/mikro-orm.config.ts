import { Options } from 'mikro-orm';
import cfg from '@nixt/config';

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

export default config;
