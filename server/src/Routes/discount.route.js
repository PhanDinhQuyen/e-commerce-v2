const { handlerCatchError } = require("../Utils");
const DiscountController = require("../Controllers/discount.controller");
const Auth = require("../Auth/verify.auth");
const Role = require("../Auth/verify.role");
const route = require("express").Router();
const validateDiscountPayload = require("../Middlewares/discount.mid");

route.post(
  "/create",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(validateDiscountPayload),
  handlerCatchError(DiscountController.createDiscountCode)
);

route.get(
  "/get",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(DiscountController.getAllDiscountCodesWithProduct)
);

module.exports = route;
