import { Module } from "@nestjs/common";
import { OrmModule } from "../orm/orm.module.js";
import { UserEntity } from "../orm/schema/entities/user.entity.js";
import { UserController } from "./controllers/user.controller.js";
import { UserService } from "./services/user.service.js";

@Module({
  imports: [OrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
