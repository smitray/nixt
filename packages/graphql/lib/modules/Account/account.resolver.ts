import { AuthenticationError } from 'apollo-server-koa';
import { Resolver, Mutation, Args, Ctx, Authorized } from 'type-graphql';
import DI from '@DI';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import BaseContext from '@util/context/base.context';
import GenericMessageDTOoutput from '@util/sharedDTO/generic-mesage-output-dto';
import User from '@module/User/user.entity';
import Account from './account.entity';
import CreateAccountDTO from './dto/create-account';
import LoginDTO from './dto/account-login';
import AccountPasswordDTO from './dto/account-password';
import UpdateAccountDTO from './dto/update-account';

/**
 * * Account module to store all authetication methods
 * TODO: Implement Tests
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
    const user = new User(account);

    try {
      await DI.AccountRepository.persistAndFlush(account);
      await DI.UserRepository.persistAndFlush(user);
      account.token = await this.generateJWT({
        accountId: account.id,
        userId: user.id,
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

    const user = await DI.UserRepository.findOneOrFail({
      account: account.id,
    });

    account.token = await this.generateJWT({
      accountId: account.id,
      userId: user.id,
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
}
