import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { MikroORM, IDatabaseDriver, Connection } from 'mikro-orm';
import { buildSchema } from 'type-graphql';
import cors from '@koa/cors';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import config from '@nixt/config';
import { verify } from 'jsonwebtoken';
import Account from '@module/Account/account.entity';
import BaseContext from '@util/context/base.context';
import mikroConfig, { DI } from '@DI';

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
    try {
      this.orm = await MikroORM.init(mikroConfig);
      DI.orm = this.orm;
      DI.em = this.orm.em;
      DI.AccountRepository = this.orm.em.getRepository(Account);
    } catch (error) {
      throw new Error(error);
    }
  }

  async setupGraphQl(): Promise<void> {
    try {
      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [`${__dirname}/modules/**/*.resolver.{ts,js}`],
          emitSchemaFile: false,
          // authChecker: ({ context }) => {
          //   console.log(context);
          //   return true;
          // },
        }),
        context: (context: Koa.Context): BaseContext | undefined => {
          const {
            ctx: {
              request: {
                header: { authorization: token },
              },
            },
          } = context;
          if (token) {
            if (token && token.split(' ')[0] !== 'Bearer') {
              throw new Error('Invalid Authorization Header');
            }
            const decoded = verify(
              token.split(' ')[1],
              process.env.SECRET || '',
            );

            return decoded as BaseContext;
          }
          return undefined;
        },
        playground: !(process.env.NODE_ENV === 'production'),
      });
      apolloServer.applyMiddleware({
        app: this.app,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  serverSetup(): void {
    this.app.use(cors());
    this.app.use(mount('/public', serveStatic(config.publicPath)));
  }

  startApp(): void {
    this.app
      .listen(config.port, config.host, () => {
        console.info('Server started on:', {
          host: config.host,
          port: config.port,
        });
      })
      .on('error', (error) => console.error(error));
  }
}
