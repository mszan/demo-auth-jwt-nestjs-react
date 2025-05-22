import { RESPONSE_ERROR_SYMBOL } from "./src/modules/app/middlewares/req-res-log.middleware.ts";
import { NodeEnv } from "./src/modules/config/config.types.ts";

type BooleanString = "true" | "false";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_NAME: string;
      DB_PASS: string;
      DB_PORT: string;
      DB_USER: string;
      NEST_DEBUG: BooleanString;
      NODE_ENV: NodeEnv;
      NPM_CONFIG_LOGLEVEL: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }

  namespace Express {
    interface Response {
      [RESPONSE_ERROR_SYMBOL]?: unknown;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
