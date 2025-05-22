import { PostgreSqlDriver, defineConfig } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Logger } from "@nestjs/common";
import { ConfigService } from "../config/services/config.service.js";
import { NodeEnv } from "../config/config.types.js";

const logger = new Logger(`ORM`);
const configService = new ConfigService();

const entitiesPath = "/opt/source/dist/src/modules/orm/schema/entities/**/*.js";
const entitiesTsPath = import.meta.dirname + "/schema/entities/**/*.ts";
logger.debug(`${Object.keys({ entitiesPath })[0]}: ${entitiesPath}`);
logger.debug(`${Object.keys({ entitiesTsPath })[0]}: ${entitiesTsPath}`);

const ormConfig = defineConfig({
  user: configService.get("database.user"),
  password: configService.get("database.password"),
  dbName: configService.get("database.database"),
  host: configService.get("database.host"),
  port: Number(configService.get("database.port")),
  driver: PostgreSqlDriver,
  debug: configService.get("app.environment") != NodeEnv.PRODUCTION,
  metadataProvider: TsMorphMetadataProvider,
  logger: logger.debug.bind(logger),
  forceUtcTimezone: true,

  entities: [entitiesPath],
  entitiesTs: [entitiesTsPath],

  migrations: {
    path: "./src/modules/orm/migrations",
    tableName: "migrations",
    transactional: true,
    snapshot: false,
  },

  seeder: {
    path: "./src/modules/orm/seeder",
    defaultSeeder: "DatabaseSeeder",
  },
});

export default ormConfig;
