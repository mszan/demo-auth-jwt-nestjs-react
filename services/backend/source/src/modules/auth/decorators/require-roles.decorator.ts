import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { UserRole } from "../../orm/schema/enums/user-role.js";

export const ROLES_KEY = "roles";
/**
 * Route handler Decorator.
 *
 * Attaches custom roles metadata to route handlers.
 * This metadata supplies missing `roles` data, which jwt guard needs to make decisions.
 */
export const RequireRoles = (
  requiredRoles: UserRole[]
): CustomDecorator<string> => {
  if (!requiredRoles || requiredRoles.length === 0) {
    throw new Error(
      `You must pass at least one role to the ${RequireRoles.name} decorator`
    );
  }

  return SetMetadata(ROLES_KEY, requiredRoles);
};
