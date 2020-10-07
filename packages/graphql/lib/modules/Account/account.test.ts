import { gql } from 'apollo-server-koa';
import { createTestClient } from 'apollo-server-testing';
import faker from 'faker';

import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import DI from '@DI';
import initConnection from '@util/testSetup/init-test-connection';
import initServer from '@util/server/type-graphql';
