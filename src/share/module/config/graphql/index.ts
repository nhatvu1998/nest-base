import { Injectable, Logger } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';
import chalk from 'chalk';
import * as depthLimit from "graphql-depth-limit";
import { ConfigService } from '../config.service';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private configService: ConfigService,
  ) {}

  createGqlOptions(): GqlModuleOptions {
    const GRAPHQL_DEPTH_LIMIT = +this.configService.get('GRAPHQL_DEPTH_LIMIT');
    return {
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      installSubscriptionHandlers: true,
      validationRules: [
        depthLimit(
          GRAPHQL_DEPTH_LIMIT!,
          { ignore: [/_trusted$/, 'idontcare'] },
          (depths: { [x: string]: number; }) => {
            if (depths[''] === GRAPHQL_DEPTH_LIMIT! - 1) {
              Logger.warn(
                `⚠️  You can only descend ${chalk
                  .hex('#bae7ff'!)
                  .bold(`${GRAPHQL_DEPTH_LIMIT!}`)} levels.`,
                'GraphQL',
                false,
              );
            }
          }
        )
      ],
      bodyParserConfig: { limit: '50mb' },
      context: ({ req, connection }) => {
        if (connection) {
          return connection.context;
        }
        return { req };
      },
    };
  }
}
