export type ApiResponseFormatter<T = unknown> = (
  statusCode: number,
  data: T,
  message: string,
  success: boolean,
) => Record<string, unknown>;

const defaultFormatter: ApiResponseFormatter = (
  statusCode,
  data,
  message,
  success,
) => ({
  statusCode,
  data,
  message,
  success,
});

export class ApiResponse<T = unknown> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  private static _formatter: ApiResponseFormatter = defaultFormatter;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static setFormatter<T = unknown>(formatter: ApiResponseFormatter<T>): void {
    ApiResponse._formatter = formatter as ApiResponseFormatter;
  }

  static resetFormatter(): void {
    ApiResponse._formatter = defaultFormatter;
  }

  toJSON(): Record<string, unknown> {
    return ApiResponse._formatter(
      this.statusCode,
      this.data,
      this.message,
      this.success,
    );
  }
}
