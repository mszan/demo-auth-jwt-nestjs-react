import { PipeTransform } from "@nestjs/common";
import {
  CorsOptions,
  CorsOptionsDelegate,
} from "@nestjs/common/interfaces/external/cors-options.interface.js";
import { GlobalPrefixOptions } from "@nestjs/common/interfaces/global-prefix-options.interface.js";
import { RouteInfo } from "@nestjs/common/interfaces/index.js";
import { SwaggerCustomOptions } from "@nestjs/swagger";

export type SwaggerTagName = "app" | "auth" | "user";

export type Configs = {
  [key in NodeEnv]: Config;
};

export type Config = {
  app: {
    cors: CorsOptions | CorsOptionsDelegate<unknown>;
    environment: NodeEnv;
    middlewares: unknown[];
    pipes: PipeTransform<unknown>[];
    port: number;
    prefix: [prefix: string, options?: GlobalPrefixOptions<string | RouteInfo>];
    swagger: {
      contact: {
        email: string;
        name: string;
        url: string;
      };
      customOptions: SwaggerCustomOptions;
      description: string;
      isEnabled: boolean;
      tags: { [x in SwaggerTagName]: { description: string } };
      title: string;
      url: string;
    };
    version: string;
  };
  auth: {
    jwt: {
      accessToken: {
        expirationTime: string;
        ignoreExpiration: boolean;
        secret: string;
      };
      refreshToken: {
        expirationTime: string;
        secret: string;
      };
    };
  };
  database: {
    name: string;
    host: string;
    password: string;
    port: string;
    user: string;
  };
};

// this should be in a shared lib or some other dir
export enum NodeEnv {
  LOCAL = "local",
  STAGING = "staging",
  PRODUCTION = "production",
}
