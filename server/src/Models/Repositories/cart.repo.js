const CartModel = require("../cart.model");

const findCartById = async (cartId) => {
  const cart = await CartModel.findOne({
    _id: cartId,
    cartState: "active",
  })
    .lean()
    .exec();

  return cart;
};

module.exports = { findCartById };
