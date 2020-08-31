import { AuthChecker } from 'type-graphql';
import BaseContext from '@util/context/base.context';

const authChecker: AuthChecker<BaseContext> = ({ context }, roles): boolean => {
  const {
    accountId,
    // userId,
    role,
  } = context;

  if (!accountId) {
    throw new Error('You are not authorized to access this method');
  }

  if (roles.length === 0) {
    return true;
  }

  if (!roles.includes(role)) {
    throw new Error(`${role} is not allowed for this method`);
  }

  throw new Error('Authorization failed');
};

export default authChecker;
