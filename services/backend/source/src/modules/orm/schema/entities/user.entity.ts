import { Entity, EntityRepositoryType, Enum, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";
import { UserDto } from "../../../user/dto/user.dto.js";
import { UserRole } from "../enums/user-role.js";
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

  public toDto(): UserDto {
    return {
      uuid: this.uuid,
      username: this.username,
      roles: this.roles,
    };
  }

  static createFixture(override: Partial<UserEntity> = {}): UserEntity {
    const user = new UserEntity();
    Object.assign(user, {
      uuid: uuid(),
      ...override,
    });
    return user;
  }
}
