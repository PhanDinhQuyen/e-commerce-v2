const CartModel = require("../Models/cart.model");
const { isObjectId } = require("../Utils");
const { queryProduct } = require("../Models/Repositories/product.repo");
const { NotFoundRequestError } = require("../Handlers/error.handler");
class CartService {
  static interfaceCartProduct = (holderProduct, product) => {
    return {
      productId: holderProduct._id,
      productQuantity: product.productQuantity,
      productShopId: holderProduct.auth,
      productPrice: holderProduct.productPrice,
    };
  };

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
      const cart = [];
      for (let i = 0; i < products.length; i++) {
        const holderProduct = await queryProduct({
          _id: isObjectId(products[i].productId),
          auth: products[i].auth,
          isPublic: true,
        });

        if (!holderProduct) {
          throw new NotFoundRequestError("Product not found");
        }
        cart.push(this.interfaceCartProduct(holderProduct, products[i]));
      }
      cartHolder.cartProducts = cart;
      return await cartHolder.save();
    }
    const cartProducts = cartHolder.cartProducts;
    for (const product of products) {
      // Iterate over the new products
      const existingProductIndex = cartProducts.findIndex((item) => {
        return item.productId.toString() === product.productId;
      });

      const holderProduct = await queryProduct({
        _id: isObjectId(product.productId),
        auth: product.productShopId,
        isPublic: true,
      });
      if (!holderProduct) {
        throw new NotFoundRequestError("Product not found");
      }

      if (existingProductIndex !== -1) {
        cartProducts[existingProductIndex].productQuantity +=
          product.productQuantity;

        cartProducts[existingProductIndex].productPrice =
          holderProduct.productPrice;
      } else {
        cartProducts.push(this.interfaceCartProduct(holderProduct, product));
      }
    }

    cartHolder.cartProducts = cartProducts;

    return await cartHolder.save();
  }

  static async deleteProductsCartUser({ products, cartUserId }) {
    const query = { cartUserId, cartStatus: "active" };
    const update = {
      $pull: {
        cartProducts: {
          productId: { $in: products.map((product) => product.productId) },
        },
      },
    };
    const options = { new: true };
    return await CartModel.findOneAndUpdate(query, update, options);
  }

  static async getCartByUserId({ cartUserId }) {
    const cart = await CartModel.findOne({ cartUserId }).lean().exec();
    if (!cart) {
      throw new NotFoundRequestError("Cart not found");
    }
    return cart;
  }
}

module.exports = CartService;
