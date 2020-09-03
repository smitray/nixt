import {
  ArgsType,
  // Field
} from 'type-graphql';
import CreateUserDTO from './user-create';
// import {} from 'class-validator';

@ArgsType()
export default class UpdateUserDTO extends CreateUserDTO {}
