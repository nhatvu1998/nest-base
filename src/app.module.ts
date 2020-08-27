import { Module } from '@nestjs/common';
import { AuthModule } from './feature/auth/auth.module';
import { UserModule } from './feature/user/user.module';
import { GqlConfigService } from './share/module/config/graphql';
import { ConfigModule } from './share/module/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeormConfigService } from './share/module/config/typeorm';
import { UsersResolver } from './feature/user/user.resolver';
import { JwtStrategy } from './feature/auth/strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeormConfigService,
    }),
    GraphQLModule.forRootAsync({
      useClass: GqlConfigService,
    }),
    AuthModule,
    UserModule,
  ],
  providers: [UsersResolver, JwtStrategy],
})
export class AppModule {}
