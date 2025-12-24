import { ApiError } from "../utils/ApiError";

export const errorHandler = (err: unknown) => {
  if (err instanceof ApiError) {
    return {
      statusCode: err.statusCode,
      body: {
        success: false,
        message: err.message,
        errors: err.errors,
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      success: false,
      message: "Internal Server Error",
    },
  };
};
