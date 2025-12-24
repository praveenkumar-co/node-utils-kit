import { describe, it, expect } from "vitest";
import { errorHandler } from "../src/middlewares/errorHandler";
import { ApiError } from "../src/utils/ApiError";

describe("errorHandler", () => {
  it("should handle ApiError correctly", () => {
    const err = new ApiError(401, "Unauthorized", ["token"]);

    const result = errorHandler(err);

    expect(result.statusCode).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Unauthorized");
    expect(result.body.errors).toEqual(["token"]);
  });

  it("should handle unknown errors with 500", () => {
    const result = errorHandler(new Error("Random error"));

    expect(result.statusCode).toBe(500);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Internal Server Error");
  });
});
