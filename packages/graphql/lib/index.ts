import 'dotenv/config';
import 'reflect-metadata';
import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { MikroORM } from 'mikro-orm';
import { buildSchema } from 'type-graphql';
import config from '@nixt/config';
