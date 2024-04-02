const { isObjectId } = require("../../Utils");

const DiscountModel = require("../../Models/discount.model");

const foundDiscountCode = async ({ discountCode, auth }) =>
  await DiscountModel.findOne({ discountCode, auth: isObjectId(auth) })
    .lean()
    .exec();

module.exports = {
  foundDiscountCode,
};
