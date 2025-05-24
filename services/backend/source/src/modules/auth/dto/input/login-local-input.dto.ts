import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginLocalInputDto {
  @ApiProperty({
    type: () => String,
    example: "imUser",
  })
  @IsNotEmpty()
  @IsString()
  readonly username!: string;

  @ApiProperty({
    type: () => String,
    example: "Test@1234",
  })
  @IsNotEmpty()
  @IsString()
  readonly password!: string;
}
