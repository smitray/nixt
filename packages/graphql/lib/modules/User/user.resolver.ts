import {
  Resolver,
  Mutation,
  Args,
  Ctx,
  Authorized,
  Query,
  FieldResolver,
} from 'type-graphql';
import DI from '@DI';
import { AuthenticationError } from 'apollo-server-koa';
import Account from '@module/Account/account.entity';
import BaseContext from '@util/context/base.context';
import GenericMessageDTOoutput from '@util/sharedDTO/generic-mesage-output-dto';
import User from './user.entity';
import CreateUserDTO from './dto/user-create';
import UpdateUserDTO from './dto/user-update';

/**
 * Module Description
 */

@Resolver(User)
export default class UserResolver {
  @Authorized()
  @Mutation(() => User)
  async CreateUser(
    @Args() dto: CreateUserDTO,
    @Ctx() { userId }: BaseContext,
  ): Promise<User> {
    const { firstName, lastName } = dto;
    const user = await DI.UserRepository.findOne({
      id: userId,
    });
    if (!user) {
      throw new Error('No user found');
    }
    user.firstName = firstName;
    user.lastName = lastName;
    try {
      await DI.UserRepository.persistAndFlush(user);
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }

  @Authorized()
  @Mutation(() => GenericMessageDTOoutput)
  async UpdateUser(
    @Ctx() { userId }: BaseContext,
    @Args() dto: UpdateUserDTO,
  ): Promise<GenericMessageDTOoutput> {
    try {
      await DI.UserRepository.nativeUpdate(
        {
          id: userId,
        },
        dto,
      );
      return {
        message: 'User has been updated successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized()
  @Query(() => User)
  async Me(@Ctx() { userId }: BaseContext): Promise<User> {
    const user = await DI.UserRepository.findOneOrFail({ id: userId });
    if (!user) {
      throw new AuthenticationError('No user found');
    }
    return user;
  }

  @Authorized()
  @FieldResolver()
  async account(@Ctx() { accountId }: BaseContext): Promise<Account> {
    const account = await DI.AccountRepository.findOneOrFail({
      id: accountId,
    });
    return account;
  }
}
