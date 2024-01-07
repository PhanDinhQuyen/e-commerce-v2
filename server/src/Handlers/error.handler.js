const { ReasonPhrases, StatusCodes } = require("http-status-codes");

/**
 * Custom error class representing a generic error response
 *
 * @class ErrorResponse
 * @extends {Error}
 * @param {string} message - The error message.
 * @param {number} statusCode - The HTTP status code.
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
  }
}

/**
 * Custom error class representing a "Not Found" error response.
 *
 * @class NotFoundRequestError
 * @extends {ErrorResponse}
 * @param {string} [message=ReasonPhrases.NOT_FOUND] - The error message.
 * @param {number} [statusCode=StatusCodes.NOT_FOUND] - The HTTP status code.
 */
class NotFoundRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

/**
 * Custom error class representing a "Bad Request" error response.
 *
 * @class BadRequestError
 * @extends {ErrorResponse}
 * @param {string} [message=ReasonPhrases.BAD_REQUEST] - The error message.
 * @param {number} [statusCode=StatusCodes.BAD_REQUEST] - The HTTP status code.
 */
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

/**
 * Custom error class representing an "Unauthorized" error response.
 *
 * @class UnAuthorizedError
 * @extends {ErrorResponse}
 * @param {string} [message=ReasonPhrases.UNAUTHORIZED] - The error message.
 * @param {number} [statusCode=StatusCodes.UNAUTHORIZED] - The HTTP status code.
 */
class UnAuthorizedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
  NotFoundRequestError,
  UnAuthorizedError,
};
