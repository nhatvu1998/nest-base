import { Args, Query, Resolver, Context, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => UserEntity)
  async getUser(@Args('id') id: string) {
    return this.userService.findOne(id);
  }
}
