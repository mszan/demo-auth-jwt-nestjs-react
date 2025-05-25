import { ApiProperty } from "@nestjs/swagger";

export class JwtLoginResDto {
  @ApiProperty({
    type: () => String,
  })
  readonly accessToken!: string;

  @ApiProperty({
    type: () => String,
  })
  readonly refreshToken!: string;
}
