const { SuccessResponse } = require("../Handlers/success.handler");
const CartService = require("../Services/cart.service");

class CartController {
  static addProductsToCart = async (req, res) =>
    new SuccessResponse(
      await CartService.addProductsToCart({
        cartUserId: req.auth,
        data: req.body,
      })
    ).create(res);
  static deleteProductsUserCart = async (req, res) =>
    new SuccessResponse(
      await CartService.deleteProductsCartUser({
        cartUserId: req.auth,
        data: req.body,
      })
    ).create(res);
  static getCartByUserId = async (req, res) =>
    new SuccessResponse(
      await CartService.getCartByUserId({ cartUserId: req.auth })
    ).create(res);
}

module.exports = CartController;
