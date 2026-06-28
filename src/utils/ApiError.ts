export type ApiErrorFormatter = (
  statusCode: number,
  message: string,
  errors: unknown[],
  success: false,
) => Record<string, unknown>;

const defaultFormatter: ApiErrorFormatter = (statusCode, message, errors, success) => ({
  statusCode,
  message,
  errors,
  success,
});

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success = false as const;
  public readonly errors: unknown[];

  private static _formatter: ApiErrorFormatter = defaultFormatter;

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

  static setFormatter(formatter: ApiErrorFormatter): void {
    ApiError._formatter = formatter;
  }

  static resetFormatter(): void {
    ApiError._formatter = defaultFormatter;
  }

  toJSON(): Record<string, unknown> {
    return ApiError._formatter(this.statusCode, this.message, this.errors, false);
  }
}
