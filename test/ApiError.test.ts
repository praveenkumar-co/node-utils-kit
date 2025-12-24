import { describe , it , expect } from "vitest";
import { ApiError } from "../src/utils/ApiError";

describe("ApiError", () => {
     it("should create ApiError with correct properties", () => {
    const err = new ApiError(404, "Not Found", ["detail"]);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not Found");
    expect(err.errors).toEqual(["detail"]);
    expect(err.success).toBe(false);
     });
     it("should create ApiError with default properties", () => {
    const err = new ApiError(404);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Something went wrong");
    expect(err.errors).toEqual([]);
    expect(err.success).toBe(false);
     });
})