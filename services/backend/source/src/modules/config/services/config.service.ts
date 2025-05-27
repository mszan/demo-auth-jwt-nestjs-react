import { Injectable } from "@nestjs/common";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import Joi, { ValidationResult } from "joi";
import _ from "lodash";
import { createCustomValidationPipe } from "../../app/pipes/create-custom-validation.pipe.js";
import { Config, Configs, NodeEnv } from "../config.types.js";

/**
 * Creates a union type of all possible dot-notation paths in an object
 * For example, given { a: { b: string }, c: number }, Path<T> would be "a" | "a.b" | "c"
 *
 * How it works:
 * 1. keyof T extends infer K - Get all top-level keys and store them as K
 * 2. K extends string & keyof T - For each key K (ensuring it's a string)
 * 3. T[K] extends Record<string, unknown> - Check if value at key K is an object
 *    - If it's an object: include both the key itself AND all nested paths (K.nestedPath)
 *    - If it's not an object: include just the key
 */
type Path<T> = keyof T extends infer K
  ? K extends string & keyof T
    ? T[K] extends Record<string, unknown>
      ? K | `${K}.${Path<T[K]>}`
      : K
    : never
  : never;

/**
 * Gets the type of the value at a specific path in an object
 * For example, given { a: { b: string }, c: number }, PathValue<T, "a.b"> would be string
 *
 * How it works:
 * 1. P extends keyof T - Check if path is a direct key of T
 *    - If direct key: return T[P] (direct property access)
 * 2. P extends `${infer K}.${infer Rest}` - If path has dot notation, split into K and Rest
 *    - K extends keyof T - If K is a valid key of T
 *      - Return PathValue<T[K], Rest> (recursively get value from nested path)
 *    - Otherwise return never (invalid path)
 */
type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : never;

@Injectable()
export class ConfigService {
  private readonly configs: Configs;
  private readonly config: Config;

  constructor() {
    this.configs = {
      [NodeEnv.LOCAL]: {
        ...this.getBaseConfig(NodeEnv.LOCAL),
        // ...
      },
      [NodeEnv.STAGING]: _.merge(this.getBaseConfig(NodeEnv.STAGING), {
        auth: {
          jwt: {
            accessToken: {
              ignoreExpiration: false,
            },
          },
        },
      } as Partial<Config>),
      [NodeEnv.PRODUCTION]: _.merge(this.getBaseConfig(NodeEnv.PRODUCTION), {
        auth: {
          jwt: {
            accessToken: {
              ignoreExpiration: false,
            },
          },
        },
      } as Partial<Config>),
    };

    this.config = this.getConfigInstance();
  }

  private validateConfig(input: Config): ValidationResult<unknown> {
    const schema = Joi.object({
      app: Joi.object({
        cors: Joi.object().required(),
        environment: Joi.string()
          .valid(...Object.values(NodeEnv))
          .required(),
        middlewares: Joi.array().required(),
        pipes: Joi.array().required(),
        port: Joi.number().required(),
        prefix: Joi.array().required(),
        swagger: Joi.object({
          contact: Joi.object().required(),
          customOptions: Joi.object().required(),
          description: Joi.string().allow("").required(),
          isEnabled: Joi.boolean().required(),
          tags: Joi.object().required(),
          title: Joi.string().required(),
          url: Joi.string().required(),
        }).required(),
        version: Joi.string().required(),
      }).required(),
      auth: Joi.object({
        jwt: Joi.object({
          accessToken: Joi.object().required(),
          refreshToken: Joi.object().required(),
        }).required(),
      }).required(),
      database: Joi.object({
        database: Joi.string().required(),
        host: Joi.string().required(),
        password: Joi.string().required(),
        port: Joi.string().required(),
        user: Joi.string().required(),
      }).required(),
      urls: Joi.object({
        frontend: Joi.string().required(),
      }).required(),
    });

    return schema.validate(input, {
      abortEarly: false,
      debug: true,
      allowUnknown: false,
    });
  }

  private getBaseConfig(env: NodeEnv): Config {
    return {
      app: {
        cors: { origin: "*" },
        environment: env,
        middlewares: [
          cookieParser(),
          helmet(),
          bodyParser.json({ limit: "50mb" }),
          bodyParser.urlencoded({ limit: "50mb" }),
        ],
        pipes: [createCustomValidationPipe()],
        port: 3000,
        prefix: ["v1", { exclude: ["healthcheck"] }],
        swagger: {
          contact: {
            email: "dmszanowski@icloud.com",
            name: "Dawid Mszanowski",
            url: "https://github.com/mszan/kraftcode-auth-demo",
          },
          customOptions: {
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "kraftapp api - docs",
            swaggerOptions: {
              operationsSorter: "alpha",
              persistAuthorization: true,
              tagsSorter: "alpha",
            },
          },
          description: "",
          isEnabled: true,
          tags: {
            app: {
              description: "Technical endpoints related to the application.",
            },
            auth: {
              description:
                "Endpoints related to authentication and authorization.",
            },
            user: { description: "Endpoints related to the user entity." },
          },
          title: "kraftapp api",
          url: "docs",
        },
        version: "1.0.0",
      },
      auth: {
        jwt: {
          accessToken: {
            expirationTime: "20s",
            ignoreExpiration: true,
            secret: process.env.JWT_ACCESS_SECRET,
          },
          refreshToken: {
            expirationTime: "7d",
            secret: process.env.JWT_REFRESH_SECRET,
          },
        },
      },
      database: {
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
      },
    };
  }

  private getConfigInstance(
    validator = this.validateConfig,
    env = process.env.NODE_ENV
  ): Config {
    if (!Object.values(NodeEnv).includes(env)) {
      throw new Error(`Invalid NODE_ENV: ${env}`);
    }

    const config = this.configs[env];
    const { error } = validator(config);

    if (error) {
      throw new Error(`Config validation failed: ${error.message}`);
    }

    return config;
  }

  /** Gets a configuration value by its dot-notation path */
  get<P extends Path<Config>>(path: P): PathValue<Config, P> {
    const keys = path.split(".") as string[];
    let value: unknown = this.config;

    for (const key of keys) {
      if (value === undefined || value === null) {
        return undefined as never;
      }
      value = (value as Record<string, unknown>)[key];
    }

    return value as PathValue<Config, P>;
  }
}
