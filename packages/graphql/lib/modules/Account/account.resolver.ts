import { AuthenticationError } from 'apollo-server-koa';
import { Resolver, Mutation, Args, Query, Ctx, Authorized } from 'type-graphql';
import { DI } from '@DI';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import BaseContext from '@util/context/base.context';
import GenericMessageDTOoutput from '@util/sharedDTO/generic-mesage-output-dto';
import Account from './account.entity';
import CreateAccountDTO from './DTO/create-account';
import LoginDTO from './DTO/account-login';
import AccountPasswordDTO from './DTO/account-password';
import UpdateAccountDTO from './DTO/update-account';

/**
 * TODO: Account delete with Admin authorization
 * ? Populate user or use dataloader
 * * Need to add tests for all the resolvers
 */

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

  @Authorized()
  @Mutation(() => GenericMessageDTOoutput)
  async UpdatePassword(
    @Ctx() { accountId }: BaseContext,
    @Args() dto: AccountPasswordDTO,
  ): Promise<GenericMessageDTOoutput> {
    const { password, confirm } = dto;
    if (password !== confirm) {
      throw new Error('password did not match');
    }
    const account = await DI.AccountRepository.findOne({
      id: accountId,
    });
    if (!account) {
      throw new AuthenticationError('No user found');
    }
    account.password = this.generatePassword(password);
    try {
      await DI.AccountRepository.persistAndFlush(account);
    } catch (error) {
      throw new Error(error);
    }

    return {
      message: 'Password successfully changed',
    };
  }

  @Authorized()
  @Mutation(() => GenericMessageDTOoutput)
  async UpdateAccount(
    @Ctx() { accountId }: BaseContext,
    @Args() dto: UpdateAccountDTO,
  ): Promise<GenericMessageDTOoutput> {
    try {
      await DI.AccountRepository.nativeUpdate(
        {
          id: accountId,
        },
        dto,
      );
      return {
        message: 'Account has been updated successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized()
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
