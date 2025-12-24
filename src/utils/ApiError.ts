export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success = false;
  public readonly errors: unknown[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: unknown[] = [],
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;

    const captureStackTrace = (
      Error as unknown as {
        captureStackTrace?: (target: object, ctor?: new (...args: never[]) => unknown) => void;
      }
    ).captureStackTrace;

    if (typeof captureStackTrace === "function") {
      captureStackTrace(this, this.constructor as new (...args: never[]) => unknown);
    }
  }
}
