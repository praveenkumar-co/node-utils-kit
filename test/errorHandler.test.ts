import { describe, it, expect, afterEach } from "vitest";
import { errorHandler } from "../src/middlewares/errorHandler";
import { ApiError } from "../src/utils/ApiError";

afterEach(() => {
  ApiError.resetFormatter();
});

describe("errorHandler", () => {
  it("should handle ApiError correctly with default formatter", () => {
    const err = new ApiError(401, "Unauthorized", ["token"]);
    const result = errorHandler(err);

    expect(result.statusCode).toBe(401);
    expect(result.body).toEqual({
      statusCode: 401,
      message: "Unauthorized",
      errors: ["token"],
      success: false,
    });
  });

  it("should handle ApiError correctly with custom formatter", () => {
    ApiError.setFormatter((statusCode, message, errors) => ({
      code: statusCode,
      error: message,
      details: errors,
    }));

    const err = new ApiError(403, "Forbidden", ["insufficient permissions"]);
    const result = errorHandler(err);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual({
      code: 403,
      error: "Forbidden",
      details: ["insufficient permissions"],
    });
  });

  it("should handle unknown errors with 500", () => {
    const result = errorHandler(new Error("Random error"));

    expect(result.statusCode).toBe(500);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Internal Server Error");
  });
});