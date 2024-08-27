const { handlerCatchError } = require("../Utils");
const Auth = require("../Auth/verify.auth");
const InventoryController = require("../Controllers/inventory.controller");
const route = require("express").Router();

route.post(
  "/add",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(InventoryController.addStockToInventory)
);

module.exports = route;
