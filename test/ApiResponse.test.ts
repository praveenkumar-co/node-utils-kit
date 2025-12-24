import { describe, it, expect } from "vitest";
import { ApiResponse } from "../src/utils/ApiResponse";

describe("ApiResponse", () => {
  it("should mark success true for status < 400", () => {
    // for id: 1  for dummy sample data
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
});
