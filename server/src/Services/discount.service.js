const { BadRequestError } = require("../Handlers/error.handler");
const { foundDiscountCode } = require("../Models/Repositories/discount.repo");
const { queryProducts } = require("../Models/Repositories/product.repo");
const DiscountModel = require("../Models/discount.model");
const validateDiscountPayload = require("../Middlewares/discount.mid");
const { isObjectId } = require("../Utils");
class DiscountService {
  static createDiscountCode = async (payload) => {
    await validateDiscountPayload(payload);

    const holderDiscount = await foundDiscountCode(payload);

    if (holderDiscount && holderDiscount.discountStatus) {
      throw new BadRequestError("Discount is already active");
    }

    const newDiscountShop = await DiscountModel.create({
      ...payload,
      discountStartDate: new Date(payload.discountStartDate),
      discountEndDate: new Date(payload.discountEndDate),
    });

    return newDiscountShop;
  };

  static async getAllProductShopWithDiscount({ discountCode, auth, page }) {
    const discount = await foundDiscountCode({
      discountCode,
      auth: isObjectId(auth),
    });

    if (!discount || !discount.discountStatus) {
      throw new BadRequestError("Discount is not available");
    }

    const { discountAppliesTo, discountProducts } = discount;
    let products;
    if (discountAppliesTo === "all") {
      //get all products with shop id

      products = await queryProducts(
        { auth: auth, isPublic: true },
        { p: page }
      );
    }
    if (discountAppliesTo === "specific") {
      products = await queryProducts(
        { auth: auth, _id: { $all: discountProducts }, isPublic: true },
        { p: page }
      );
    }
    return products || [];
  }
  static async getAllDiscount() {}
  static async updateDiscount() {}
}

module.exports = DiscountService;
