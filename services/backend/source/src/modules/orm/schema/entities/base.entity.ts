import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

export interface BaseInterface {
  id: string;
}

@Entity({ abstract: true })
export abstract class BaseEntity implements BaseInterface {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @Property({
    columnType: "timestamp(0)",
    defaultRaw: "CURRENT_TIMESTAMP",
    nullable: false,
  })
  createdAt: Date = new Date();

  @Property({
    columnType: "timestamp(0)",
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
