const ProductController = require("../Controllers/product.controller");
const { handlerCatchError } = require("../Utils");

const Role = require("../Auth/verify.role");
const Auth = require("../Auth/verify.auth");
const route = require("express").Router();

route.post(
  "/create",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.createProduct)
);

route.get(
  "/get/public",
  handlerCatchError(ProductController.getProductsforShopPublic)
);

route.get(
  "/get/all",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.getProductsforShop)
);

module.exports = route;
