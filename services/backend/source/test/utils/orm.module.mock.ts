import { MikroOrmModule } from "@mikro-orm/nestjs";
import { defineConfig } from "@mikro-orm/postgresql";
import { DynamicModule, Module } from "@nestjs/common";
import ormConfig from "../../src/modules/orm/orm.config.js";

export const testOrmConfig = defineConfig({
  ...ormConfig,
  dynamicImportProvider: (id: string) => import(id), // for vitest to get around `TypeError: Unknown file extension ".ts"` (ERR_UNKNOWN_FILE_EXTENSION)
});

@Module({
  imports: [MikroOrmModule.forRoot(testOrmConfig)],
})
export class OrmModuleMock {
  static forFeature(entities: Parameters<typeof MikroOrmModule.forFeature>[0], contextName?: string): DynamicModule {
    return {
      module: OrmModuleMock,
      imports: [MikroOrmModule.forFeature(entities, contextName)],
      exports: [MikroOrmModule.forFeature(entities, contextName)],
    };
  }
}
