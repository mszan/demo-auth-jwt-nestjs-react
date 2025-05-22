import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Module } from "@nestjs/common";
import ormConfig from "./orm.config.js";

/**
 * This is only an abstraction layer over the MikroORM module that comes from the `@mikro-orm/nestjs` package.
 * One day it may become super handy (e.g. for mocking the ORM module in tests, adding custom repositories, etc.).
 *
 * Helpful links:
 * - https://mikro-orm.io/docs/usage-with-nestjs
 * - https://docs.nestjs.com/recipes/mikroorm
 */
@Module({
  imports: [MikroOrmModule.forRoot(ormConfig)],
})
export class OrmModule {
  static forFeature(entities: Parameters<typeof MikroOrmModule.forFeature>[0], contextName?: string): DynamicModule {
    return {
      module: OrmModule,
      imports: [MikroOrmModule.forFeature(entities, contextName)],
      exports: [MikroOrmModule.forFeature(entities, contextName)],
    };
  }
}
