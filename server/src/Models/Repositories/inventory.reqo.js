const InventoryModel = require("../inventory.model");

const insertInventory = async (payload) => {
  return await InventoryModel.create(payload);
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inventoryProductId: productId,
      inventoryStock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inventoryStock: -quantity },
      $push: {
        inventoryReservation: {
          quantity,
          cartId,
          createAt: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return await InventoryModel.findOneAndUpdate(query, updateSet, options);
};

module.exports = { insertInventory, reservationInventory };
