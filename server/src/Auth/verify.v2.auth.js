const {
  BadRequestError,
  UnAuthorizedError,
} = require("../Handlers/error.handler");
const AuthModel = require("../Models/auth.model");
const { getAuthWithId } = require("../Models/Repositories/auth.repo");
const { getTokenWithAuth } = require("../Models/Repositories/token.repo");
const TokenV2Service = require("../Services/token.v2.service");
const { isObjectId } = require("../Utils");

const HEADERS = {
  AUTHORIZATION: "authorization",
  X_CLIENT_KEY: "x-client-id",
};

class AuthV2 {
  static checkClientId = async (clientId) => {
    const client = await AuthModel.findById(isObjectId(clientId)).lean();

    if (!client) {
      throw new UnAuthorizedError();
    }

    return client;
  };
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
  static verifyAccessToken = async (req, res, next) => {
    const clientId = req.headers[HEADERS.X_CLIENT_KEY];
    const accessToken = req.headers[HEADERS.AUTHORIZATION];
    if (!accessToken || !clientId) {
      throw new BadRequestError();
    }
    const token = await this.verifyClientId(clientId);
    const publicKeyString = token.publicKey;
    const decoded = TokenV2Service.decodeToken(accessToken, publicKeyString);
  };
}
