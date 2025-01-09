import { StatusCodes } from "http-status-codes";
import { env } from "../config/environment";
export const ErrorhandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
    errors: err.errors || {}, // Default to {}
  };

  if (env.BUILD_MODE !== "dev") delete responseError.stack;

  console.error("Error response:", responseError); // Log đầy đủ thông tin
  res.status(err.statusCode).json(responseError);
};
