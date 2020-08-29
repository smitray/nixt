import { Resolver, Mutation, Args, Query, Authorized } from 'type-graphql';
import { DI } from '@DI';
import Account from './account.entity';
import { CreateAccountDTO } from './account.dto';

@Resolver(Account)
export default class AccountResolver {
  @Mutation(() => Account)
  async CreateAccount(@Args() dto: CreateAccountDTO): Promise<Account> {
    const { username, password, email, confirm } = dto;
    if (password !== confirm) {
      throw new Error('match fail');
    }
    const account = DI.AccountRepository.create({
      username,
      email,
      password,
    });

    try {
      await DI.AccountRepository.persistAndFlush(account);
    } catch (error) {
      throw new Error(error);
    }

    return account;
  }

  @Authorized()
  @Query(() => [Account])
  async GetAccounts(): Promise<Account[]> {
    return DI.AccountRepository.find({});
  }
}
