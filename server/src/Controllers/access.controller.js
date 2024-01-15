const {
  SuccessResponse,
  CreateResponse,
} = require("../Handlers/success.handler");

const AccessService = require("../Services/access.service");
const sanitize = require("../Middlewares/mongo.mid");

class AccessController {
  static signUp = async (req, res) =>
    new CreateResponse(await AccessService.signUp(sanitize(req.body))).create(
      res
    );

  static signIn = async (req, res) =>
    new SuccessResponse(await AccessService.signIn(sanitize(req.body))).create(
      res
    );

  static handleRefreshToken = async (req, res) =>
    new SuccessResponse(await AccessService.handleRefreshToken(req)).create(
      res
    );
  static logOut = async (req, res) =>
    new SuccessResponse(await AccessService.logOut(sanitize(req.body))).create(
      res
    );
}

module.exports = AccessController;
