import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class GenericMessageDTOoutput {
  @Field()
  message: string;
}
