import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import BaseContext from '@util/context/base.context';
import authChecker from '@util/middleware/auth-checker';

export default async (): Promise<ApolloServer> => {
  try {
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [`${__dirname}/../../modules/**/*.resolver.{ts,js}`],
        emitSchemaFile: false,
        authChecker,
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
          const decoded = verify(token.split(' ')[1], process.env.SECRET || '');

          return decoded as BaseContext;
        }
        return undefined;
      },
      playground: !(process.env.NODE_ENV === 'production'),
    });
    return apolloServer;
  } catch (error) {
    throw new Error(error);
  }
};
