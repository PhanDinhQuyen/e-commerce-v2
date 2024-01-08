const bcrypt = require("bcrypt");
const authModel = require("../Models/auth.model");
const {
  BadRequestError,
  UnAuthorizedError,
} = require("../Handlers/error.handler");
const TokenService = require("./token.service");
const tokenModel = require("../Models/token.model");
const { selectDataIntoObject } = require("../Utils");

/**
 * Service class for user-related operations.
 */
class AccessService {
  /**
   * Selectable data fields for user information.
   * @type {string[]}
   */
  static selectData = ["_id", "name", "role", "email", "verify"];

  /**
   * Sign up a new user.
   * @param {Object} user - The user object containing name, email, and password.
   * @param {string} user.name - The name of the user.
   * @param {string} user.email - The email of the user.
   * @param {string} user.password - The password of the user.
   * @returns {Object} - The user data.
   * @throws {BadRequestError} - If the email already exists.
   */
  static signUp = async ({ name, email, password }) => {
    const existingUser = await authModel.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);

    const user = await authModel.create({
      name,
      email,
      password: passwordHash,
    });

    return selectDataIntoObject(this.selectData, user);
  };

  /**
   * Sign in a user.
   * @param {Object} credentials - The user credentials containing email and password.
   * @param {string} credentials.email - The email of the user.
   * @param {string} credentials.password - The password of the user.
   * @returns {Object} - An object containing the user account and tokens.
   * @throws {BadRequestError} - If the email is not found or the password is invalid.
   */
  static signIn = async ({ email, password }) => {
    const user = await authModel.findOne({ email }).lean();

    if (!user) {
      throw new BadRequestError("Email not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestError("Invalid password");
    }

    const auth = user._id;
    const payload = { auth, email: user.email, role: user.role };
    const tokens = await TokenService.createTokensPair(auth, payload);

    if (!tokens) {
      throw new BadRequestError("Error creating tokens");
    }

    return {
      account: selectDataIntoObject(this.selectData, user),
      tokens,
    };
  };

  /**
   * Handle the refresh token flow.
   * @param {Object} params - The parameters.
   * @param {string} params.refreshToken - The refresh token.
   * @param {string} params.auth - The user ID.
   * @param {string} params.role - The user role.
   * @returns {Object} - An object containing new tokens.
   * @throws {UnAuthorizedError} - If the refresh token is already in use or unauthorized.
   * @throws {BadRequestError} - If the token is not found.
   */
  static handleRefreshToken = async ({ refreshToken, auth, role }) => {
    const tokenInUse = await tokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();

    if (tokenInUse) {
      await TokenService.removeToken(tokenInUse.auth);
      throw new UnAuthorizedError();
    }

    const token = await tokenModel.findOne({ auth }).lean();

    if (!token) {
      throw new BadRequestError("Token not found");
    }

    const decoded = TokenService.decodedToken(refreshToken, token.publicKey);

    if (decoded.auth !== auth) {
      throw new UnAuthorizedError();
    }

    await TokenService.addRefreshTokenUsed(auth, refreshToken);

    const payload = { auth, email: decoded.email, role };
    const newTokens = await TokenService.createTokensPair(auth, payload);

    return newTokens;
  };

  /**
   * Log out a user.
   * @param {Object} params - The parameters.
   * @param {string} params.auth - The user ID.
   * @returns {undefined}
   */
  static logOut = async ({ auth }) => {
    await TokenService.removeToken(auth);
    return;
  };
}

module.exports = AccessService;
