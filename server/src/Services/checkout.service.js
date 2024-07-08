const { NotFoundRequestError } = require("../Handlers/error.handler");
const { findCartById } = require("../Models/Repositories/cart.repo");
const { checkProductsServer } = require("../Models/Repositories/product.repo");
const DiscountService = require("./discount.service");

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
      const checkoutPrice = newProducts.reduceRight(
        (acc, product) => acc + product.price * product.productQuantity,
        0
      );

      checkoutOrders.totalPrice += checkoutPrice;

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
          });
        if (discount > 0) {
          itemsCheckout.priceApplyDiscount += totalPrice;
          checkoutOrders.totalDiscount += discount;
        }
      }
      checkoutOrders.totalCheckout += itemsCheckout.priceApplyDiscount;
      orders.push(itemsCheckout);
    }
    return {
      checkoutOrders,
      orders,
    };
  }
}

module.exports = CheckoutService;
