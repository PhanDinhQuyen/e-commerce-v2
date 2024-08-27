const { queryProduct } = require("../Models/Repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "District 7 HCM",
  }) {
    const product = await queryProduct({ _id: productId, auth: shopId });

    if (!product) {
      throw new Error("Product not found");
    }

    const query = { inventoryAuth: shopId, inventoryProductId: productId },
      update = {
        $inc: { inventoryStock: stock },
        $set: { inventoryLocation: location },
      },
      option = { upsert: true, new: true };

    return await InventoryModel.findOneAndUpdate(query, update, option);
  }
}

module.exports = InventoryService;
