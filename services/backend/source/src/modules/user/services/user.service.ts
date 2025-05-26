import { Inject, Injectable, Logger } from "@nestjs/common";
import { NotFoundException } from "../../app/exceptions/exceptions.js";
import { UserEntityRepository } from "../../orm/schema/repositories/user.repository.js";
import { UserDto } from "../dto/user.dto.js";

@Injectable()
export class UserService {
  protected readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(UserEntityRepository)
    private readonly userEntityRepository: UserEntityRepository
  ) {}

  public async getUserDto(uuid: string): Promise<UserDto> {
    const userEntity = await this.userEntityRepository.findOne({
      uuid,
    });

    if (!userEntity) {
      throw new NotFoundException();
    }

    return userEntity.toDto();
  }
}
