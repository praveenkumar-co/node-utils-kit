import { describe, it, expect } from "vitest";
import {
  withContext,
  getContext,
  setContext,
} from "../src/context/requestContext";

describe("RequestContext", () => {
  it("should store and retrieve context value", () => {
    withContext(
      {
        requestId: "req1",
        userId: "user1",
        traceId: "trace1",
        extras: {},
      },
      () => {
        const ctx = getContext();
        expect(ctx.requestId).toBe("req1");
        expect(ctx.userId).toBe("user1");
        expect(ctx.traceId).toBe("trace1");
        expect(ctx.extras).toEqual({});
      }
    );
  });

  it("should update context value", () => {
    withContext({}, () => {
      setContext({
        requestId: "req1",
        userId: "user1",
        traceId: "trace1",
        extras: {},
      });

      const ctx = getContext();
      expect(ctx.requestId).toBe("req1");
      expect(ctx.userId).toBe("user1");
      expect(ctx.traceId).toBe("trace1");
      expect(ctx.extras).toEqual({});
    });
  });

  it("should return empty context when no context is set", () => {
    const ctx = getContext();
    expect(ctx).toEqual({});
  });

  it("should support extras field", () => {
    withContext(
      {
        requestId: "req1",
        userId: "user1",
        traceId: "trace1",
        extras: { key: "value" },
      },
      () => {
        const ctx = getContext();
        expect(ctx.extras).toEqual({ key: "value" });
      }
    );
  });
});
