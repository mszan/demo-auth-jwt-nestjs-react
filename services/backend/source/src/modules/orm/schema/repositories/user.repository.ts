import { EntityRepository } from "@mikro-orm/postgresql";
import { UserEntity } from "../entities/user.entity.js";

export class UserEntityRepository extends EntityRepository<UserEntity> {
  // ...
}
