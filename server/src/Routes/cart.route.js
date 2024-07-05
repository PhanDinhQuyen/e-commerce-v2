const Auth = require("../Auth/verify.auth");
const CartController = require("../Controllers/cart.controller");

const { handlerCatchError } = require("../Utils");

const route = require("express").Router();

route.post(
  "/add/products",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(CartController.addProductToCart)
);

route.post(
  "/delete/products",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(CartController.deleteProductsUserCart)
);

route.get(
  "/get/cart",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(CartController.getCartByUserId)
);

module.exports = route;
