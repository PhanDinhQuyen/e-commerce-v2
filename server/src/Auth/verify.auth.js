const {
  UnAuthorizedError,
  BadRequestError,
} = require("../Handlers/error.handler");

const AuthModel = require("../Models/auth.model");
const TokenModel = require("../Models/token.model");
const TokenService = require("../Services/token.service");
const { isObjectId } = require("../Utils");

const HEADERS = {
  AUTHORIZATION: "authorization",
  X_CLIENT_KEY: "x-client-id",
};

/**
 * Class representing authentication methods.
 */
class Auth {
  /**
   * Check if the client ID is valid.
   *
   * @param {string} clientId - The client ID to be checked.
   * @returns {Object} - The client object if found.
   * @throws {UnAuthorizedError} - If the client ID is not valid.
   */
  static checkClientId = async (clientId) => {
    const client = await AuthModel.findById(isObjectId(clientId)).lean();

    if (!client) {
      throw new UnAuthorizedError();
    }

    return client;
  };

  /**
   * Verify client ID and refresh token for authentication.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {function} next - Express next middleware function.
   * @throws {BadRequestError} - If client ID or refresh token is missing.
   */
  static verifyClientId = async (req, res, next) => {
    const clientId = req.headers[HEADERS.X_CLIENT_KEY];
    const refreshToken = req.headers[HEADERS.AUTHORIZATION];

    if (!clientId || !refreshToken) {
      throw new BadRequestError();
    }

    const client = await this.checkClientId(clientId);

    req.auth = clientId;
    req.refreshToken = refreshToken;
    req.role = client.role;
    next();
  };

  /**
   * Verify access token for authentication.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {function} next - Express next middleware function.
   * @throws {BadRequestError} - If client ID or access token is missing.
   * @throws {UnAuthorizedError} - If access token is not valid.
   */
  static verifyAccessToken = async (req, res, next) => {
    const clientId = req.headers[HEADERS.X_CLIENT_KEY];
    const accessToken = req.headers[HEADERS.AUTHORIZATION];

    if (!clientId || !accessToken) {
      throw new BadRequestError();
    }

    const client = await this.checkClientId(clientId);
    const token = await TokenModel.findOne({ auth: clientId }).lean();

    if (!token) {
      throw new UnAuthorizedError();
    }

    const decoded = TokenService.decodedToken(accessToken, token.privateKey);

    if (
      decoded.auth !== clientId ||
      decoded.email !== client.email ||
      decoded.role !== client.role
    ) {
      throw new UnAuthorizedError();
    }

    req.auth = clientId;
    req.role = client.role;
    next();
  };
}

module.exports = Auth;
