import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AppController } from "../../../src/modules/app/controllers/app.controller.js";

describe(AppController.name, () => {
  let appController: AppController;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = testingModule.get(AppController);
  });

  describe("healthcheck", () => {
    it("should return status UP", () => {
      expect(appController.getHealthcheck()).toStrictEqual({
        status: "UP",
      });
    });
  });
});
