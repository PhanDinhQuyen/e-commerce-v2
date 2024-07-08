const { handlerCatchError } = require("../Utils");
const Auth = require("../Auth/verify.auth");
const CheckoutController = require("../Controllers/checkout.controller");
const route = require("express").Router();

route.post(
  "/review",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(CheckoutController.checkoutReview)
);

module.exports = route;
