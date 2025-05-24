import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import { UnauthorizedException } from "../../app/exceptions/exceptions.js";
import { UserEntity } from "../../orm/schema/entities/user.entity.js";
import { UserEntityRepository } from "../../orm/schema/repositories/user.repository.js";

/**
 * This strategy is used to authenticate and authorize users using a username and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @Inject(UserEntityRepository)
    private readonly userEntityRepository: UserEntityRepository
  ) {
    super({
      // by default passport-local will look at req.body.username and req.body.password, change if needed
      // usernameField: "foo",
      // passwordField: "bar",
    });
  }

  /**
   * Passport will invoke this method when a user tries to log in.
   * It will pass the username and password from the request body to this method.
   * If the user is found and the password is valid, it will return the user entity and store it in req.user, otherwise it will throw an UnauthorizedException.
   */
  async validate(username: string, password: string): Promise<UserEntity> {
    const userEntity = await this.userEntityRepository.findOne({ username });

    // use a pre-generated dummy hash for timing attack mitigation
    // perhaps there's a better (faster, more secure) way to do this
    const dummyHash = await bcrypt.hash("dummyPassword", 10);
    const passwordHash = userEntity ? userEntity.password : dummyHash;

    const isPasswordValid = bcrypt.compareSync(password, passwordHash);
    if (!userEntity || !isPasswordValid) {
      this.logger.debug("Invalid username or password");
      throw new UnauthorizedException();
    }

    return userEntity;
  }
}
