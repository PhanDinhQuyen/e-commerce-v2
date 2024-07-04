const CartModel = require("../Models/cart.model");

class CartService {
  static async createUserCart({ products, cartUserId }) {
    const query = { cartUserId };
    const updateOrInsert = { $addToSet: { cartProducts: products } };
    const options = { upsert: true, new: true };

    return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async addProductsToCart({ products, cartUserId }) {
    const cartHolder = await CartModel.findOne({ cartUserId });
    if (!cartHolder) {
      return await this.createUserCart({ products, cartUserId });
    }
    if (!cartHolder.cartProducts.length) {
      cartHolder.cartProducts = products;
      return await cartHolder.save();
    }
    const cartProducts = cartHolder.cartProducts;
    for (const product of products) {
      // Iterate over the new products
      const existingProductIndex = cartProducts.findIndex(
        (item) => item.productId === product.productId
      );
      if (existingProductIndex !== -1) {
        cartProducts[existingProductIndex].productQuantity =
          product.productQuantity;
      } else {
        cartProducts.push(product);
      }
    }
    cartHolder.cartProducts = cartProducts;
    return await cartHolder.save();
  }
}

module.exports = CartService;
