import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterInput } from './inputs/register.input';
import { LoginInput } from './inputs/login.input';
import { UserEntity } from '../user/entity/user.entity';
import { AccessToken, UserSession } from '../../share/interface/session.interface';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // @Query()
  // async getPermissionByUserId(@Args('userId') userId: number) {
  //   return this.authService.getPermissionsByUserId(userId);
  // }

  @Mutation(() => UserEntity)
  async register(@Args('userData') userData: RegisterInput) {
    return this.userService.createUser(userData);
  }

  @Mutation(() => AccessToken)
  async login(@Args('userData') userData: LoginInput) {
    return this.authService.createToken(userData);
  }
}
