const {
  SuccessResponse,
  CreateResponse,
} = require("../Handlers/success.handler");

const UserService = require("../Services/user.service");

class UserController {
  static signUp = async (req, res) =>
    new CreateResponse(await UserService.signUp(req.body)).create(res);

  static signIn = async (req, res) =>
    new SuccessResponse(await UserService.signIn(req.body)).create(res);

  static handleRefreshToken = async (req, res) =>
    new SuccessResponse(await UserService.handleRefreshToken(req)).create(res);

  static logOut = async (req, res) =>
    new SuccessResponse(await UserService.logOut(req.body)).create(res);
}

module.exports = UserController;
