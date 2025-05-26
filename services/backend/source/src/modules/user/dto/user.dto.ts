import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../orm/schema/enums/user-role.js";

export class UserDto {
  @ApiProperty({
    type: () => String,
  })
  readonly uuid!: string;

  @ApiProperty({
    type: () => String,
  })
  readonly username!: string;

  @ApiProperty({
    enum: UserRole,
    enumName: "UserRole",
    isArray: true,
  })
  readonly roles!: UserRole[];
}
