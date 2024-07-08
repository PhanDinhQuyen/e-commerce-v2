const CartModel = require("../Models/cart.model");
const { isObjectId } = require("../Utils");
const { queryProduct } = require("../Models/Repositories/product.repo");
const {
  NotFoundRequestError,
  BadRequestError,
} = require("../Handlers/error.handler");
class CartService {
  static interfaceCartProduct = (holderProduct, product) => {
    return {
      productId: holderProduct._id,
      productQuantity: product.productQuantity,
      productPrice: holderProduct.productPrice,
      productName: holderProduct.productName,
      productAttributes: holderProduct.productAttributes,
    };
  };

  static async createUserCart({ data, cartUserId }) {
    console.log(data);
    const query = { cartUserId };
    const updateOrInsert = {
      // $push: {
      //   cartProducts: {
      //     productShopId: data.productShopId,
      //     products: data.products,
      //   },
      // },
    };
    const options = { upsert: true, new: true };

    return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async addProductsToCart({ data, cartUserId }) {
    let cart = await CartModel.findOne({ cartUserId });
    if (!cart) {
      cart = await this.createUserCart({ data, cartUserId });
    }

    const _cart = [];
    if (!cart.cartProducts.length) {
      for (const items of data) {
        const productShopId = items.productShopId;
        const products = items.products;
        const objCart = { productShopId, products: [] };
        for (const item of products) {
          const product = await queryProduct({
            _id: isObjectId(item.productId),
            auth: productShopId,
            isPublic: true,
          });
          if (!product) {
            throw new NotFoundRequestError("Product not found");
          }
          objCart.products.push(this.interfaceCartProduct(product, item));
        }
        _cart.push(objCart);
      }

      cart.cartProducts = _cart;
      return await cart.save();
    }
    const cartProducts = cart.cartProducts;
    const update = data[0].products[0];
    const shopId = data[0].productShopId;

    console.log({ update, shopId });
    const foundProduct = await queryProduct({
      _id: isObjectId(update.productId),
      auth: isObjectId(shopId),
      isPublic: true,
    });
    if (!foundProduct) {
      throw new NotFoundRequestError("Product not found");
    }

    const existIndex = cartProducts.findIndex(
      (product) => product.productShopId.toString() === shopId
    );
    console.log(existIndex);
    if (existIndex !== -1) {
      const index = cartProducts[existIndex].products.findIndex(
        (product) => product.productId.toString() === update.productId
      );
      console.log(index);
      if (index !== -1) {
        const quanlity =
          cartProducts[existIndex].products[index].productQuantity +
          update.productQuantity;
        if (quanlity === 0) {
          console.log("RUN");

          cartProducts[existIndex].products.splice(index, 1);
        } else if (quanlity < 0) {
          throw new BadRequestError();
        } else {
          cartProducts[existIndex].products[index].productQuantity = quanlity;
        }
      } else {
        if (update.productQuantity <= 0) {
          throw new BadRequestError();
        }

        cartProducts[existIndex].products.push(
          this.interfaceCartProduct(foundProduct, update)
        );
      }
    } else {
      cartProducts.push({
        productShopId: shopId,
        products: this.interfaceCartProduct(foundProduct, update),
      });
    }
    cart.cartProducts = cartProducts;
    return await cart.save();
  }

  static async deleteProductsCartUser({ data, cartUserId }) {
    // Find the cart
    const cart = await CartModel.findOne({ cartUserId });

    if (!cart) {
      throw new NotFoundRequestError("Cart not found");
    }
    for (const item of data) {
      const productShopId = item.productShopId;
      const products = item.products;

      console.log("Data:", data);
      console.log("productShopId:", productShopId);
      console.log("products:", products);

      // Find the specific productShop
      const productShop = cart.cartProducts.find(
        (shop) => shop.productShopId.toString() === productShopId.toString()
      );

      if (productShop) {
        // Remove products from the specific productShop
        for (const product of products) {
          const productId = product.productId;
          productShop.products = productShop.products.filter(
            (p) => p.productId.toString() !== productId.toString()
          );
        }
      }
    }

    return await cart.save();
  }
}

module.exports = CartService;
