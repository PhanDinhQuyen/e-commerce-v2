const {
  BadRequestError,
  NotFoundRequestError,
} = require("../Handlers/error.handler");
const {
  foundDiscountCode,
  queryAllDiscountCodesWithShop,
  deleteDiscountCodesWithShop,
  updateDiscountCode,
} = require("../Models/Repositories/discount.repo");
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
    if (discountAppliesTo === "specified") {
      console.log("products");
      products = await queryProducts(
        {
          auth: auth,
          _id: { $in: discountProducts },
          isPublic: true,
        },
        { p: page }
      );
    }
    return products || [];
  }
  static async getAllDiscountCodesByShop({ auth, page }) {
    const discounts = await queryAllDiscountCodesWithShop(
      { auth, discountStatus: true },
      { p: page }
    );
    return discounts;
  }
  static async getDiscountAmount({ products, discountCode, authShop, auth }) {
    const discount = await foundDiscountCode({
      discountCode: discountCode,
      auth: authShop,
    });
    if (!discount && !discount.discountStatus) {
      throw new NotFoundRequestError("Discount not found");
    }
    const {
      discountType,
      discountValue,
      discountStartDate,
      discountEndDate,
      discountQuanlityUsed,
      discountUsersUsed,
      discountMaxUsePerUser,
      discountMinOrderValue,
      discountAppliesTo,
      discountProducts,
    } = discount;
    if (new Date(discountStartDate) > new Date()) {
      throw new BadRequestError("Discount is not available yet");
    }
    if (new Date(discountEndDate) < new Date()) {
      throw new BadRequestError("Discount has expired");
    }
    if (discountQuanlityUsed === 0) {
      throw new BadRequestError("Discount has reached maximum quantity");
    }
    const countUserUsed = discountUsersUsed.filter(
      (user) => user === auth
    ).length;

    if (countUserUsed > discountMaxUsePerUser) {
      throw new BadRequestError("Discount has reached maximum use per user");
    }
    let totalPrice = 0;
    let notDiscount = 0;

    if (discountAppliesTo === "specified") {
      for (const product of products) {
        if (discountProducts.map((id) => id.toString()).includes(product._id)) {
          totalPrice += product.price * product.quanlity;
        } else {
          notDiscount += product.price * product.quanlity;
        }
      }
    } else {
      for (const product of products) {
        totalPrice += product.price * product.quanlity;
      }
    }
    if (totalPrice === 0) {
      throw new BadRequestError("No products match the discount criteria");
    }
    if (totalPrice < discountMinOrderValue) {
      throw new BadRequestError(
        "Order value should be more than minimum order value"
      );
    }

    await updateDiscountCode(
      { auth: authShop, discountCode },
      {
        $inc: { discountQuanlityUsed: -1 },
        $push: { discountUsersUsed: isObjectId(auth) },
      }
    );

    const amount =
      discountType === "percentage"
        ? (totalPrice * discountValue) / 100
        : discountValue;
    totalPrice += notDiscount;
    return {
      totalOrder: totalPrice,
      totalPrice: totalPrice - amount,
      discount: amount,
    };
  }

  static async deleteDiscount({ auth, discountCode }) {
    const discount = await foundDiscountCode({ discountCode, auth });
    if (!discount) {
      throw new NotFoundRequestError("Discount not found");
    }
    await deleteDiscountCodesWithShop({ auth, discountCode });
    return discount;
  }

  static async cancelDiscountCode({ auth, discountCode, authShop }) {
    const discount = await foundDiscountCode({ discountCode, auth: authShop });
    if (!discount) {
      throw new NotFoundRequestError("Discount not found");
    }
    await updateDiscountCode(
      { auth: authShop, discountCode },
      {
        $pull: { discountUsersUsed: auth },
        $inc: { discountQuanlityUsed: 1 },
      }
    );
    return discount;
  }

  static async updateDiscount() {}
}

module.exports = DiscountService;
