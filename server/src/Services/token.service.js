const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const TokenModel = require("../Models/token.model");
const { BadRequestError } = require("../Handlers/error.handler");

/**
 * Generates a random buffer.
 * @returns {string} - The generated buffer.
 */
const createBuffer = () => crypto.randomBytes(64).toString("hex");

/**
 * Service class for handling token-related operations.
 */
class TokenService {
  /**
   * Creates an access token.
   * @param {Object} payload - The payload to be included in the token.
   * @param {string} buffer - The buffer used for token creation.
   * @returns {string} - The generated access token.
   */
  static createAccessToken = (payload, buffer) =>
    jwt.sign(payload, buffer, { expiresIn: "2h" });

  /**
   * Creates a refresh token.
   * @param {Object} payload - The payload to be included in the token.
   * @param {string} buffer - The buffer used for token creation.
   * @returns {string} - The generated refresh token.
   */
  static createRefreshToken = (payload, buffer) =>
    jwt.sign(payload, buffer, { expiresIn: "7days" });

  /**
   * Decodes a token.
   * @param {string} token - The token to be decoded.
   * @param {string} buffer - The buffer used for decoding the token.
   * @returns {Object} - The decoded token payload.
   * @throws {BadRequestError} - If the token is invalid.
   */
  static decodedToken = (token, buffer) => {
    try {
      return jwt.verify(token, buffer);
    } catch (error) {
      throw new BadRequestError("Invalid token");
    }
  };

  /**
   * Creates a pair of access and refresh tokens and updates the token model.
   * @param {string} auth - The user authentication identifier.
   * @param {Object} payload - The payload to be included in the tokens.
   * @returns {Object} - An object containing the generated access and refresh tokens.
   */
  static createTokensPair = async (auth, payload) => {
    const [privateKey, publicKey] = Array.from(Array(2), createBuffer);

    const [accessToken, refreshToken] = [
      this.createAccessToken(payload, privateKey),
      this.createRefreshToken(payload, publicKey),
    ];

    const query = { auth };
    const updates = { privateKey, publicKey, refreshTokensUsed: [] };
    const options = { new: true, upsert: true };

    await TokenModel.findOneAndUpdate(query, updates, options);

    return { accessToken, refreshToken };
  };

  /**
   * Adds a refresh token to the list of used tokens in the token model.
   * @param {string} auth - The user authentication identifier.
   * @param {string} refreshToken - The refresh token to be added.
   * @returns {Object} - The updated token document.
   */
  static addRefreshTokenUsed = async (auth, refreshToken) =>
    TokenModel.findOneAndUpdate(
      { auth },
      { $addToSet: { refreshTokensUsed: refreshToken } },
      { new: true }
    );

  /**
   * Removes a token from the token model.
   * @param {string} auth - The user authentication identifier.
   * @returns {boolean} - True if the token is successfully removed.
   */
  static removeToken = async (auth) => {
    await TokenModel.findOneAndDelete({ auth });
    return true;
  };
}

module.exports = TokenService;
