const ProductController = require("../Controllers/product.controller");
const { handlerCatchError } = require("../Utils");

const Role = require("../Auth/verify.role");

const route = require("express").Router();

route.post(
  "/create",
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.createProduct)
);

module.exports = route;
