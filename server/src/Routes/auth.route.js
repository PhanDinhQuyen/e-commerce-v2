const route = require("express").Router();

const UserController = require("../Controllers/user.controller");
const Auth = require("../Auth/verify.auth");
const {
  validateSignInData,
  validateSignUpData,
} = require("../Middlewares/sign.mid");
const { handlerCatchError } = require("../Utils");

route.post(
  "/signup",
  handlerCatchError(validateSignUpData),
  handlerCatchError(UserController.signUp)
);
route.post(
  "/signin",
  handlerCatchError(validateSignInData),
  handlerCatchError(UserController.signIn)
);
route.post(
  "/refreshtoken",
  handlerCatchError(Auth.verifyClientId),
  handlerCatchError(UserController.handleRefreshToken)
);
route.post(
  "/logout",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(UserController.logOut)
);

module.exports = route;
