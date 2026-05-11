import { describe, it, expect, vi } from "vitest";
import { asyncHandler } from "../src/utils/AsyncHandler";
import { ApiError } from "../src/utils/ApiError";

describe("asyncHandler", () => {
  it("should call handler successfully and NOT call next", async () => {
    const handler = vi.fn().mockResolvedValue("ok");
    const wrapped = asyncHandler(handler);

    const next = vi.fn();

    await wrapped({}, {}, next); 

    expect(handler).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should forward error to next when handler rejects", async () => {
    const error = new ApiError(400, "Test Error");
    const handler = vi.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(handler);

    const next = vi.fn();
    await wrapped({}, {}, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
