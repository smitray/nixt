import { gql } from 'apollo-server-koa';
import { createTestClient } from 'apollo-server-testing';
import faker from 'faker';

import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import initConnection from '@util/testSetup/init-test-connection';
import DI from '@DI';
import initServer from '@util/server/type-graphql';
