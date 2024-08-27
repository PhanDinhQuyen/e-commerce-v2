const { SuccessResponse } = require("../Handlers/success.handler");
const InventoryService = require("../Services/inventory.service");

class InventoryController {
  static addStockToInventory = async (req, res) =>
    new SuccessResponse(
      await InventoryService.addStockToInventory({
        shopId: req.auth,
        ...req.body,
      })
    ).create(res);
}

module.exports = InventoryController;
