import Koa from 'koa';
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import cors from '@koa/cors';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import config from '@nixt/config';
import MikroOrmSetup from '@util/server/orm';
import TypeGraphSetup from '@util/server/type-graphql';
import loggerMain from 'tracer';

const logger = loggerMain.colorConsole();

export default class Server {
  app: Koa;

  public orm: MikroORM<IDatabaseDriver<Connection>>;

  async init(): Promise<void> {
    this.app = new Koa();
    await this.setupORM();
    await this.setupGraphQl();
    await this.serverSetup();
  }

  async setupORM(): Promise<void> {
    const mongoAuth = process.env.MONGO_USER
      ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@`
      : '';
    const clientUrl = `mongodb://${mongoAuth}${config.host}:${config.mongodb.mongoPort}`;
    await MikroOrmSetup(clientUrl);
  }

  async setupGraphQl(): Promise<void> {
    const apolloServer = await TypeGraphSetup();
    apolloServer.applyMiddleware({
      app: this.app,
    });
  }

  serverSetup(): void {
    this.app.use(cors());
    this.app.use(mount('/public', serveStatic(config.publicPath)));
  }

  startApp(): void {
    this.app
      .listen(config.port, config.host, () => {
        logger.info('Server started on:', {
          host: config.host,
          port: config.port,
        });
      })
      .on('error', (error) => {
        logger.error(error);
      });
  }
}
