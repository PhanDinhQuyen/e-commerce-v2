const { ReasonPhrases, StatusCodes } = require("http-status-codes");

/**
 * Represents a base response with common properties and methods.
 *
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {string} message - The message associated with the response.
 * @param {Object} data - The data included in the response.
 */
class BaseResponse {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Creates a JSON response with the specified status code, message, and data.
   *
   * @param {Object} res - The Express response object.
   * @returns {Object} - The JSON response.
   */
  create(res) {
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      message: this.message,
      metaData: this.data,
    });
  }
}

/**
 * Represents a success response with a 200 OK status code.
 *
 * @param {Object} data - The data included in the response.
 */
class SuccessResponse extends BaseResponse {
  constructor(data) {
    super(StatusCodes.OK, ReasonPhrases.OK, data);
  }
}

/**
 * Represents a response for successful creation with a 201 Created status code.
 *
 * @param {Object} data - The data included in the response.
 */
class CreateResponse extends BaseResponse {
  constructor(data) {
    super(StatusCodes.CREATED, ReasonPhrases.CREATED, data);
  }
}

module.exports = {
  SuccessResponse,
  CreateResponse,
};
