import { Test, TestingModule } from "@nestjs/testing";
import { ValidationResult } from "joi";
import { afterEach } from "node:test";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Config, NodeEnv } from "../../../src/modules/config/config.types.js";
import { ConfigService } from "../../../src/modules/config/services/config.service.js";

describe(ConfigService.name, () => {
  const OLD_ENV = process.env;
  let service: ConfigService;

  beforeEach(async () => {
    vi.resetModules();
    process.env = { ...OLD_ENV }; // clone env

    const testingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = testingModule.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = OLD_ENV; // restore env
  });

  describe(ConfigService.prototype["getConfigInstance"].name, () => {
    it("should return config for local env", () => {
      process.env.NODE_ENV = NodeEnv.LOCAL;
      const mockValidator = vi
        .fn()
        .mockImplementation(() => ({ error: undefined }));
      const config = service["getConfigInstance"](mockValidator);
      expect(config.app.environment).toEqual(NodeEnv.LOCAL);
    });

    it("should return config for staging env", () => {
      process.env.NODE_ENV = NodeEnv.STAGING;
      const mockValidator = vi
        .fn()
        .mockImplementation(() => ({ error: undefined }));
      const config = service["getConfigInstance"](mockValidator);
      expect(config.app.environment).toEqual(NodeEnv.STAGING);
    });

    it("should return config for production env", () => {
      process.env.NODE_ENV = NodeEnv.PRODUCTION;
      const mockValidator = vi
        .fn()
        .mockImplementation(() => ({ error: undefined }));
      const config = service["getConfigInstance"](mockValidator);
      expect(config.app.environment).toEqual(NodeEnv.PRODUCTION);
    });

    it("should throw for invalid config", async () => {
      const mockValidator = vi
        .fn()
        .mockImplementation((): ValidationResult<unknown> => {
          return {
            error: {
              isJoi: true,
              name: "ValidationError",
              message: "invalid config",
              details: [],
              _original: {},
              annotate: function (): string {
                return "";
              },
            },
            value: {},
          };
        });

      expect(() => service["getConfigInstance"](mockValidator)).toThrow(
        "Config validation failed: invalid config"
      );
    });

    it("should throw for invalid NODE_ENV", () => {
      process.env.NODE_ENV = "invalid_env" as unknown as NodeEnv;
      expect(() => service["getConfigInstance"]()).toThrow(
        "Invalid NODE_ENV: invalid_env"
      );
    });
  });

  describe(ConfigService.prototype["validateConfig"].name, () => {
    it("should validate config", () => {
      const localConfig = service["configs"][NodeEnv.LOCAL];
      const { error } = service["validateConfig"](localConfig);
      expect(error).toBeUndefined();
    });

    it("should throw for invalid config structure", () => {
      const invalidConfig = {} as unknown as Config;
      const { error } = service["validateConfig"](invalidConfig);
      expect(error).toBeDefined();
    });
  });

  describe(ConfigService.prototype.get.name, () => {
    it("should return value for valid path", () => {
      process.env.NODE_ENV = NodeEnv.LOCAL;
      const value = service.get("app.environment");
      expect(value).toEqual(NodeEnv.LOCAL);
    });

    it("should return undefined for invalid path", () => {
      process.env.NODE_ENV = NodeEnv.LOCAL;
      const value = service.get("invalid.path" as never);
      expect(value).toBeUndefined();
    });

    it("should return undefined for empty path", () => {
      process.env.NODE_ENV = NodeEnv.LOCAL;
      const value = service.get("" as never);
      expect(value).toBeUndefined();
    });
  });
});
