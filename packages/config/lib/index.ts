import configEnvironment from './environment';
import paths from './paths';

export default { ...configEnvironment(process.env.NODE_ENV), ...paths };
