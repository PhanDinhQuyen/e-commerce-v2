const { handlerCatchError } = require("../Utils");
const DiscountController = require("../Controllers/discount.controller");
const Auth = require("../Auth/verify.auth");
const Role = require("../Auth/verify.role");
const route = require("express").Router();

route.post(
  "/create",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(DiscountController)
);

module.exports = route;
