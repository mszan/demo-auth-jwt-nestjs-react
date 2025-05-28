import { ConsoleLogger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./modules/app/app.module.js";
import { allExceptions } from "./modules/app/exceptions/exceptions.js";
import { ConfigService } from "./modules/config/services/config.service.js";

async function bootstrap(): Promise<void> {
  const configService = new ConfigService();

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
      compact: false,
      sorted: true,
      logLevels: ["debug", "error", "log", "verbose", "warn"],
      showHidden: true,
    }),
  });

  app.enableCors(configService.get("app.cors"));
  app.use(...configService.get("app.middlewares"));
  app.useGlobalPipes(...configService.get("app.pipes"));
  app.setGlobalPrefix(...configService.get("app.prefix"));

  if (configService.get("app.swagger.isEnabled")) {
    const docBuilder = new DocumentBuilder()
      .addBearerAuth()
      .setTitle(configService.get("app.swagger.title"))
      .setDescription(configService.get("app.swagger.description"))
      .setContact(
        configService.get("app.swagger.contact.name"),
        configService.get("app.swagger.contact.url"),
        configService.get("app.swagger.contact.email")
      )
      .setExternalDoc("json", `/${configService.get("app.swagger.url")}-json`)
      .setVersion(configService.get("app.version"));

    for (const key in configService.get("app.swagger.tags")) {
      const tags = configService.get("app.swagger.tags");
      const val = tags[key as keyof typeof tags];
      docBuilder.addTag(key, val.description);
    }
    const docConfig = docBuilder.build();

    const document = SwaggerModule.createDocument(app, docConfig, {
      deepScanRoutes: true,
      extraModels: allExceptions,
    });
    SwaggerModule.setup(
      configService.get("app.swagger.url"),
      app,
      document,
      configService.get("app.swagger.customOptions")
    );
  }

  app.enableShutdownHooks(); // https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
  await app.listen(configService.get("app.port"));
}

bootstrap();
