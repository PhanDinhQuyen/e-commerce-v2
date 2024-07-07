const Auth = require("../Auth/verify.auth");
const OrderController = require("../Controllers/order.controller");
const { handlerCatchError } = require("../Utils");

const route = require("express").Router();

route.get("/create/guest", handlerCatchError(OrderController.createOrderUser));
route.get(
  "/create/user",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(OrderController.createOrderUser)
);

module.exports = route;

// Update the following code snippet to include the necessary routes for managing orders
