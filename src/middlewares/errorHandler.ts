import { ApiError } from "../utils/ApiError";

export const errorHandler = (err: unknown) => {
  if (err instanceof ApiError) {
    return {
      statusCode : err.statusCode,
        body : err.toJSON(),
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
