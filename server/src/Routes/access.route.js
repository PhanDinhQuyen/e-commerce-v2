const route = require("express").Router();

const AccessController = require("../Controllers/access.controller");
const Auth = require("../Auth/verify.auth");

const { handlerCatchError } = require("../Utils");

// console.log(typeof validateSignUpData); // Should print "function"
// console.log(typeof AccessController.signUp); // Should print "function"

route.post("/signup", handlerCatchError(AccessController.signUp));
route.post("/signin", handlerCatchError(AccessController.signIn));
route.post(
  "/refreshtoken",
  handlerCatchError(Auth.verifyClientId),
  handlerCatchError(AccessController.handleRefreshToken)
);
route.post(
  "/logout",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(AccessController.logOut)
);

module.exports = route;
