import config from '@nixt/config';
import MikroOrmSetup from '@util/server/orm';

const clientUrl = `mongodb://${config.host}:${config.mongodb.mongoPort}`;

export default async (dropData = false): Promise<void> => {
  await MikroOrmSetup(clientUrl, dropData);
};
