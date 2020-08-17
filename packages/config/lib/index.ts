import dotenv from 'dotenv';

import configEnvironment from './environment';

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const environments = result.parsed;

export default {
  ...environments,
  ...configEnvironment[process.env.NODE_ENV],
};
