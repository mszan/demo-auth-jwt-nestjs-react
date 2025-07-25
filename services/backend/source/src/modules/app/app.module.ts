import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ConfigModule } from "../config/config.module.js";
import { AppController } from "./controllers/app.controller.js";
import { ExceptionFilter } from "./exceptions/filters/exception.filter.js";
import { ReqResLogMiddleware } from "./middlewares/req-res-log.middleware.js";
import { AuthModule } from "../auth/auth.module.js";
import { UserModule } from "../user/user.module.js";

@Module({
  imports: [ConfigModule, AuthModule, UserModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ReqResLogMiddleware).forRoutes("*path");
  }
}
