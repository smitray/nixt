import DI from '@DI';
import initConnection from './init-test-connection';

initConnection(true)
  .then(() => {
    DI.orm.close();
    return true;
  })
  .catch((error) => {
    throw new Error(error);
  });
