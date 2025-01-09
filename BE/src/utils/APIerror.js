class APIError extends Error {
  constructor(statusCode, message, errors = {}) {
    // Default errors to {}
    super(message);
    console.log("errors: ", errors);

    this.name = "APIError";
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default APIError;
