import { ExecutionContext } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocalGuard } from "../../../src/modules/auth/guards/local.guard.js";

describe(LocalGuard.name, () => {
  let guard: LocalGuard;
  let executionContext: ExecutionContext;

  beforeEach(() => {
    guard = new LocalGuard();
    // Minimal fake context: only methods your guard actually touches
    executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {}, body: {} }),
      }),
    } as unknown as ExecutionContext;
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it(`should call parent class' canActivate`, async () => {
    // spy on the parent class' canActivate
    const superProto = Object.getPrototypeOf(LocalGuard.prototype);

    const canActivateSpy = vi
      .spyOn(superProto, "canActivate")
      // pretend the strategy succeeded
      .mockImplementation(() => Promise.resolve(true));

    const res = await guard.canActivate(executionContext);
    expect(canActivateSpy).toHaveBeenCalledWith(executionContext);
    expect(res).toBe(true);

    canActivateSpy.mockRestore();
  });
});
