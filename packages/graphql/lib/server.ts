import Koa from 'koa';
// import { ApolloServer } from 'apollo-server-koa';
import { Connection, IDatabaseDriver, MikroORM } from 'mikro-orm';
// import { buildSchema } from 'type-graphql';
// import config from '@nixt/config';
import mikroConfig from './mikro-orm.config';

export default class Server {
  app: Koa;

  public orm: MikroORM<IDatabaseDriver<Connection>>;

  async init(): Promise<void> {
    await this.setupOrm();
  }

  async setupOrm(): Promise<void> {
    try {
      this.orm = await MikroORM.init(mikroConfig);
    } catch (error) {
      throw new Error(error);
    }
  }
}
