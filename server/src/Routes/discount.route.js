const { handlerCatchError } = require("../Utils");
const DiscountController = require("../Controllers/discount.controller");
const Auth = require("../Auth/verify.auth");
const Role = require("../Auth/verify.role");
const route = require("express").Router();

route.post(
  "/create",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(DiscountController.createDiscountCode)
);

route.get(
  "/get/products",
  handlerCatchError(DiscountController.getAllProductShopWithDiscount)
);

route.get(
  "/get/discounts",
  handlerCatchError(DiscountController.getAllDiscountCodeWithShop)
);

route.get(
  "/get/amount",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(DiscountController.getDiscountAmount)
);

route.get(
  "/get/cancel",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(DiscountController.cancelDiscountCode)
);

route.delete(
  "/delete/discount",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(DiscountController.deleteDiscount)
);

module.exports = route;
