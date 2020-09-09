import DI from '@DI';
import MikroOrm from '@util/server/orm';
import config from '@nixt/config';

const clientUrl = `mongodb://${config.host}:${config.mongodb.mongoPort}`;

MikroOrm(clientUrl)
  .then(() => {
    DI.orm.close();
    return true;
  })
  .catch((error) => {
    throw new Error(error);
  });
