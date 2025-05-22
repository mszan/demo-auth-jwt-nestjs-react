import { Test, TestingModule } from "@nestjs/testing";
import { ValidationResult } from "joi";
import { afterEach } from "node:test";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Config, NodeEnv } from "../../../src/modules/config/config.types.js";
import { ConfigService } from "../../../src/modules/config/services/config.service.js";

describe("app config", () => {
  const OLD_ENV = process.env;
  let service: ConfigService;

  beforeEach(async () => {
    vi.resetModules();
    process.env = { ...OLD_ENV }; // clone env

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = testingModule.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = OLD_ENV; // restore env
  });

  describe(ConfigService.prototype["getConfigInstance"].name, () => {
    it("should return config for all envs", () => {
      for (const env of Object.values(NodeEnv)) {
        process.env.NODE_ENV = env;
        const mockValidator = vi
          .fn()
          .mockImplementation(() => ({ error: undefined }));
        const config = service["getConfigInstance"](mockValidator);
        expect(config.app.environment).toEqual(env);
      }
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

  describe("validateConfig", () => {
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
});
