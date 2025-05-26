import store from "store2";
import { OpenAPI } from "./client/generated";

export enum NodeEnv {
  LOCAL = "local",
  STAGING = "staging",
  PRODUCTION = "production",
}

export type Configs = {
  [key in NodeEnv]: Config;
};

export type Config = {
  urls: {
    frontend: string;
    backend: string;
  };
};

/**
 * All defined app configs.
 */
export const configs: Configs = {
  local: {
    urls: {
      frontend: "http://localhost:7030",
      backend: "http://localhost:7010",
    },
  },
  staging: {
    urls: {
      frontend: "https://stg.kraftapp.com",
      backend: "https://api-stg.kraftapp.com",
    },
  },
  production: {
    urls: {
      frontend: "https://kraftapp.com",
      backend: "https://api.kraftapp.com",
    },
  },
};

/**
 * One specific app config this app uses that was determinated by ``process.env.NODE_ENV``.
 */
export let configFactory: () => Config;

OpenAPI.TOKEN = store.get("jwtTokens")?.accessToken;

switch (import.meta.env.VITE_HOST_ENV) {
  case NodeEnv.LOCAL:
    OpenAPI.BASE = configs.local.urls.backend;
    configFactory = () => configs.local;
    break;
  case NodeEnv.STAGING:
    OpenAPI.BASE = configs.staging.urls.backend;
    configFactory = () => configs.staging;
    break;
  case NodeEnv.PRODUCTION:
    OpenAPI.BASE = configs.production.urls.backend;
    configFactory = () => configs.production;
    break;
  default:
    throw new Error(
      "Could not load application config. See app.config.ts for details."
    );
}

/**
 * Initialized config.
 */
export const configInstance = configFactory();
