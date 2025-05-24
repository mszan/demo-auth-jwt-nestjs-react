import { Controller, Get, INestApplication } from "@nestjs/common";
import { ApiResponse, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  OpenAPIObject,
  OperationObject,
  ResponseObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface.js";
import { Test, TestingModule } from "@nestjs/testing";
import { afterEach } from "node:test";
import { beforeEach, describe, expect, it } from "vitest";
import {
  exceptionDataSet,
  NotFoundException,
} from "../../src/modules/app/exceptions/exceptions.js";

@Controller("dummy")
class DummyController {
  @Get()
  @ApiResponse({
    status: exceptionDataSet.NOT_FOUND.httpStatus,
    type: NotFoundException,
  })
  dummyMethod() {
    return "ok";
  }
}

describe("exceptions", () => {
  let app: INestApplication;
  let routeDef: OperationObject;
  let document: OpenAPIObject;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [DummyController],
    }).compile();

    app = testingModule.createNestApplication();
    const config = new DocumentBuilder().setTitle("").build();
    document = SwaggerModule.createDocument(app, config);
    await app.init();

    routeDef = document.paths["/dummy"]["get"] as OperationObject;
  });

  afterEach(async () => {
    await app.close();
  });

  it("should define exception spec", () => {
    const routeDefResponse = routeDef.responses["404"] as ResponseObject;

    // verify the schema reference exists and points to the correct component
    expect(routeDefResponse.content?.["application/json"].schema).toEqual({
      $ref: "#/components/schemas/NotFoundException",
    });

    // verify that the component actually exists in the schema
    expect(document.components?.schemas?.NotFoundException).toBeDefined();
  });
});
