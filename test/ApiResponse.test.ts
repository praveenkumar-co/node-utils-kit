import { describe, it, expect, afterEach } from "vitest";
import { ApiResponse } from "../src/utils/ApiResponse";

afterEach(() => {
  ApiResponse.resetFormatter();
});

describe("ApiResponse — default format", () => {
  it("should mark success true for status < 400", () => {
    const res = new ApiResponse(200, { id: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(res.message).toBe("Success");
    expect(res.success).toBe(true);
  });

  it("should mark success false for status >= 400", () => {
    const res = new ApiResponse(400, null, "Bad Request");

    expect(res.statusCode).toBe(400);
    expect(res.message).toBe("Bad Request");
    expect(res.success).toBe(false);
  });

  it("toJSON should produce default shape when no formatter is set", () => {
    const res = new ApiResponse(200, { id: 1 }, "Fetched");
    const json = res.toJSON();

    expect(json).toEqual({
      statusCode: 200,
      data: { id: 1 },
      message: "Fetched",
      success: true,
    });
  });
});

describe("ApiResponse — custom formatter", () => {
  it("should apply a globally registered formatter", () => {
    ApiResponse.setFormatter((statusCode, data, _message, success) => ({
      code: statusCode,
      payload: data,
      ok: success,
    }));

    const res = new ApiResponse(200, { id: 1 }, "Fetched");
    const json = res.toJSON();

    expect(json).toEqual({
      code: 200,
      payload: { id: 1 },
      ok: true,
    });
  });

  it("formatter should apply to every instance after registration", () => {
    ApiResponse.setFormatter((statusCode, data, message) => ({
      status: statusCode,
      result: data,
      msg: message,
    }));

    const first = new ApiResponse(200, "data-a", "OK").toJSON();
    const second = new ApiResponse(201, "data-b", "Created").toJSON();

    expect(first).toMatchObject({ status: 200, result: "data-a", msg: "OK" });
    expect(second).toMatchObject({ status: 201, result: "data-b", msg: "Created" });
  });

  it("resetFormatter should restore the default shape", () => {
    ApiResponse.setFormatter(() => ({ custom: true }));
    ApiResponse.resetFormatter();

    const json = new ApiResponse(200, { id: 1 }).toJSON();

    expect(json).toHaveProperty("statusCode", 200);
    expect(json).toHaveProperty("success", true);
    expect(json).not.toHaveProperty("custom");
  });
});