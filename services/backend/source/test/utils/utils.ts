import { AnyEntity, SelectQueryBuilder } from "@mikro-orm/postgresql";
import { mock } from "vitest-mock-extended";

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function createMockQb<T extends AnyEntity>(count: number): SelectQueryBuilder<T> {
  const qb = mock<SelectQueryBuilder<T>>();
  qb.where.mockReturnThis();
  qb.count.mockResolvedValue(count);
  return qb;
}
