const {
  SuccessResponse,
  CreateResponse,
} = require("../Handlers/success.handler");

const AccessService = require("../Services/access.service");

class AccessController {
  static signUp = async (req, res) =>
    new CreateResponse(await AccessService.signUp(req.body)).create(res);

  static signIn = async (req, res) =>
    new SuccessResponse(await AccessService.signIn(req.body)).create(res);

  static handleRefreshToken = async (req, res) =>
    new SuccessResponse(await AccessService.handleRefreshToken(req)).create(
      res
    );
  static logOut = async (req, res) =>
    new SuccessResponse(await AccessService.logOut(req.body)).create(res);
}

module.exports = AccessController;
