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

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
