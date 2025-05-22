import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { UserEntity } from "../schema/entities/user.entity.js";
import { UserRole } from "../schema/interfaces/user-role.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DatabaseSeeder extends Seeder {
  private logger = new Logger(DatabaseSeeder.name);

  async run(em: EntityManager): Promise<void> {
    this.logger.log(`Running...`);

    // users
    const userImUser = new UserEntity();
    userImUser.username = "imUser";
    userImUser.password = bcrypt.hashSync("Test@1234", 10);
    userImUser.roles = [UserRole.USER];
    em.persist(userImUser);

    const userImAdmin = new UserEntity();
    userImAdmin.username = "imAdmin";
    userImAdmin.password = bcrypt.hashSync("Test@1234", 10);
    userImAdmin.roles = [UserRole.USER, UserRole.ADMIN];
    em.persist(userImAdmin);

    this.logger.log(`Done.`);
  }
}
