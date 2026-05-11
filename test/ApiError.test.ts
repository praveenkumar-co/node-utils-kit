import { describe, it, expect, afterEach } from "vitest";
import { ApiError } from "../src/utils/ApiError";

afterEach(() => {
  ApiError.resetFormatter();
});

describe("ApiError — default format", () => {
  it("should create ApiError with correct properties", () => {
    const err = new ApiError(404, "Not Found", ["detail"]);

    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not Found");
    expect(err.errors).toEqual(["detail"]);
    expect(err.success).toBe(false);
  });

  it("should create ApiError with default properties", () => {
    const err = new ApiError(404);

    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Something went wrong");
    expect(err.errors).toEqual([]);
    expect(err.success).toBe(false);
  });

  it("toJSON should produce default shape when no formatter is set", () => {
    const err = new ApiError(401, "Unauthorized", ["token"]);
    const json = err.toJSON();

    expect(json).toEqual({
      statusCode: 401,
      message: "Unauthorized",
      errors: ["token"],
      success: false,
    });
  });
});

describe("ApiError — custom formatter", () => {
  it("should apply a globally registered formatter", () => {
    ApiError.setFormatter((statusCode, message, errors) => ({
      code: statusCode,
      error: message,
      details: errors,
      ok: false,
    }));

    const err = new ApiError(403, "Forbidden", ["insufficient permissions"]);
    const json = err.toJSON();

    expect(json).toEqual({
      code: 403,
      error: "Forbidden",
      details: ["insufficient permissions"],
      ok: false,
    });
  });

  it("formatter should apply to every instance after registration", () => {
    ApiError.setFormatter((statusCode, message) => ({
      status: statusCode,
      msg: message,
    }));

    const first = new ApiError(400, "Bad Request").toJSON();
    const second = new ApiError(500, "Internal Server Error").toJSON();

    expect(first).toMatchObject({ status: 400, msg: "Bad Request" });
    expect(second).toMatchObject({ status: 500, msg: "Internal Server Error" });
  });

  it("resetFormatter should restore the default shape", () => {
    ApiError.setFormatter(() => ({ custom: true }));
    ApiError.resetFormatter();

    const json = new ApiError(400, "Bad Request").toJSON();

    expect(json).toHaveProperty("statusCode", 400);
    expect(json).toHaveProperty("success", false);
    expect(json).not.toHaveProperty("custom");
  });
});