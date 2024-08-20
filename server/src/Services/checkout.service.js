const {
  NotFoundRequestError,
  BadRequestError,
} = require("../Handlers/error.handler");
const OrderModel = require("../Models/order.model");
const { findCartById } = require("../Models/Repositories/cart.repo");
const { checkProductsServer } = require("../Models/Repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquiredLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /** 
   * 
                cartId,
                userId,
                oders: 
                ["productShopId": "",
                "shopDiscounts": []
                "products": [
                    {
                        "productId": "",
                        "productQuantity": "",
                        "productPrice": "",
                        "productAttributes": {},
                        "productName": ""
                    }
                  ]]
   * 
   * **/
  static async checkoutReview({ cartId, userId, data }) {
    console.log(cartId, userId, data.orders);
    const cart = await findCartById(cartId);
    if (!cart) {
      throw new NotFoundRequestError("Cart not found");
    }

    const checkoutOrders = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const orders = [];

    for (const order of data.orders) {
      const { productShopId, shopDiscounts, products } = order;
      const newProducts = await checkProductsServer(products, productShopId);
      const checkoutPrice = newProducts.reduce(
        (acc, product) => acc + product.productPrice * product.productQuantity,
        0
      );

      const itemsCheckout = {
        shopId: productShopId,
        shopDiscounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: 0,
        products: newProducts,
      };
      if (itemsCheckout.shopDiscounts.length !== 0) {
        const { discount = 0, totalPrice = 0 } =
          await DiscountService.getDiscountAmount({
            products: itemsCheckout.products,
            discountCode: itemsCheckout.shopDiscounts[0].discountCode,
            authShop: productShopId,
            auth: userId,
            discountId: itemsCheckout.shopDiscounts[0].discountId,
          });
        if (discount > 0) {
          itemsCheckout.priceApplyDiscount += totalPrice;
          checkoutOrders.totalDiscount += discount;
        }
      } else {
        checkoutOrders.totalPrice = itemsCheckout.priceRaw;
        checkoutOrders.totalCheckout = itemsCheckout.priceRaw;
      }
      checkoutOrders.totalCheckout += itemsCheckout.priceApplyDiscount;
      orders.push(itemsCheckout);
    }
    return {
      data,
      checkoutOrders,
      orders,
    };
  }

  static async orderByUser({ data, cartId, userId, userAddress, userPayment }) {
    const { checkoutOrders, orders } = await this.checkoutReview({
      cartId,
      userId,
      data,
    });

    const allProducts = orders.flatMap((order) => order.products);

    const acquiredProducts = [];

    for (const product of allProducts) {
      const { productId, productQuantity } = product;
      const keyLock = await acquiredLock(productId, productQuantity, cartId);
      acquiredProducts.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquiredProducts.includes(false)) {
      throw new BadRequestError(
        "Some products have already been, please try again"
      );
    }

    const newOrder = await OrderModel.create({
      orderCheckOut: checkoutOrders,
      orderAddress: userAddress,
      orderPayment: userPayment,
      orderUser: userId,
      orderItems: orders,
    });
    return newOrder;
  }
}

module.exports = CheckoutService;
