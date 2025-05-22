import { Entity, EntityRepositoryType, Enum, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";
import { UserRole } from "../interfaces/user-role.js";
import { UserEntityRepository } from "../repositories/user.repository.js";
import { BaseEntity } from "./base.entity.js";

@Entity({
  repository: () => UserEntityRepository,
})
export class UserEntity extends BaseEntity {
  [EntityRepositoryType]?: UserEntityRepository;

  @Property({
    length: 255,
    nullable: false,
    unique: true,
  })
  username!: string;

  @Property({
    length: 255,
    nullable: false,
    hidden: true,
  })
  password!: string;

  @Enum({ default: [UserRole.USER], nullable: false })
  roles = [UserRole.USER];

  @Property({ nullable: true, hidden: true })
  refreshToken: string | null = null;

  static createFixture(override: Partial<UserEntity> = {}): UserEntity {
    const user = new UserEntity();
    Object.assign(user, {
      id: uuid(),
      ...override,
    });
    return user;
  }
}
