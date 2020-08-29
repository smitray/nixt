import { AuthenticationError } from 'apollo-server-koa';
import { Resolver, Mutation, Args, Query, Ctx } from 'type-graphql';
import { DI } from '@DI';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import BaseContext from '@util/context/base.context';
import Account from './account.entity';
import { CreateAccountDTO, LoginDTO } from './account.dto';

@Resolver(Account)
export default class AccountResolver {
  private generatePassword(password: string): string {
    const salt = genSaltSync();
    const hash = hashSync(password, salt);
    return hash;
  }

  private generateJWT(data: BaseContext): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        data,
        process.env.SECRET || '',
        {
          expiresIn: '6h',
        },
        (error, token) => {
          if (error) {
            reject(error);
          }
          resolve(token);
        },
      );
    });
  }

  @Mutation(() => Account)
  async CreateAccount(@Args() dto: CreateAccountDTO): Promise<Account> {
    const { username, password, email, confirm, role, status, phone } = dto;
    if (password !== confirm) {
      throw new Error('password did not match');
    }
    const account = DI.AccountRepository.create({
      username,
      email,
      password: this.generatePassword(password),
      role,
      status,
      phone,
    });

    try {
      await DI.AccountRepository.persistAndFlush(account);
      account.token = await this.generateJWT({
        accountId: account.id,
        userId: '',
        role: account.role,
      });
    } catch (error) {
      throw new Error(error);
    }

    return account;
  }

  @Mutation(() => Account)
  async Login(@Args() dto: LoginDTO): Promise<Account> {
    const account = await DI.AccountRepository.findOne({
      $or: [
        {
          username: dto.username,
        },
        {
          email: dto.email,
        },
      ],
    });

    if (!account) {
      throw new AuthenticationError('No user found');
    } else if (account && !compareSync(dto.password, account.password)) {
      throw new AuthenticationError('Wrong password');
    }

    account.token = await this.generateJWT({
      accountId: account.id,
      userId: '',
      role: account.role,
    });

    return account;
  }

  @Query(() => Account)
  async Me(@Ctx() { accountId }: BaseContext): Promise<Account> {
    const account = await DI.AccountRepository.findOne({
      id: accountId,
    });
    if (!account) {
      throw new AuthenticationError('No user found');
    }

    return account;
  }
}
