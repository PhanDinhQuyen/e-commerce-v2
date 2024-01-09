const ProductController = require("../Controllers/product.controller");
const { handlerCatchError } = require("../Utils");

const route = require("express").Router();

route.post("/create", handlerCatchError(ProductController.createProduct));

module.exports = route;
