const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  getPublicKeyWithAuth,
  storageToken,
  removeTokenWithAuth,
  getTokenWithAuth,
} = require("../Models/Repositories/token.repo");
const {
  BadRequestError,
  UnAuthorizedError,
} = require("../Handlers/error.handler");
const createKeysPairSync = () =>
  crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

class TokenV2Service {
  static async createTokensPair(payload) {
    const { publicKey, privateKey } = createKeysPairSync();
    const publicKeyString = publicKey.toString();
    const filter = { auth: payload.auth };
    const update = { publicKey: publicKeyString };
    const options = { new: true, upsert: true };
    console.log("Filter:", filter);
    console.log("Update:", update);
    console.log("Options:", options);
    await storageToken(filter, update, options);
    const holderToken = await getTokenWithAuth(filter.auth);
    console.log(holderToken);
    if (!holderToken) {
      throw new BadRequestError("Failed to create token for user");
      ``;
    }
    const accessToken = jwt.sign(payload, privateKey, {
      expiresIn: "1h",
      algorithm: "RS256",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7d",
      algorithm: "RS256",
    });
    return { accessToken, refreshToken };
  }

  static decodeToken = async (auth, token) => {
    const publicKeyString = await getPublicKeyWithAuth(auth);
    if (!publicKeyString) {
      throw new UnAuthorizedError("No public key found for this auth");
    }
    const decoded = jwt.decode(token, publicKeyString, (err, result) => {
      if (err) {
        throw new UnAuthorizedError("Invalid token");
      }
      return result;
    });
    return decoded;
  };

  static addRefreshTokenUsed = async (auth, refreshToken) => {
    const filter = { auth };
    const update = {
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    };
    const options = { new: true };
    const holderToken = await storageToken(filter, update, options);
    if (!holderToken) {
      throw new BadRequestError("Failed to add refresh token to user");
    }
    return true;
  };
  static removeToken = async (auth) => {
    const holderToken = await removeTokenWithAuth(auth);
    if (!holderToken) {
      throw new UnAuthorizedError("Failed to remove token");
    }
    return true;
  };
}

module.exports = TokenV2Service;
