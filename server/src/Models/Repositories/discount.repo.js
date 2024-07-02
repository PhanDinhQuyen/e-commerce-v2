const { isObjectId } = require("../../Utils");

const DiscountModel = require("../../Models/discount.model");

const foundDiscountCode = async ({ discountCode, auth }) =>
  await DiscountModel.findOne({ discountCode, auth: isObjectId(auth) })
    .lean()
    .exec();

const queryAllDiscountCodesWithShop = async (
  q = {},
  { l = 8, p = 1, s = "createdAt" } = {}
) => {
  const skip = (p - 1) * l;
  return await DiscountModel.find(q)
    .sort(s)
    .skip(Math.max(skip, 0))
    .limit(l)
    .lean()
    .exec();
};
const deleteDiscountCodesWithShop = async ({ auth, discountCode }) =>
  await DiscountModel.findOneAndDelete({
    auth,
    discountCode,
  });

const updateDiscountCode = async ({ auth, discountCode, update }) => {
  const discount = await DiscountModel.findOneAndUpdate(
    { auth, discountCode },
    update,
    { new: true }
  )
    .lean()
    .exec();
  return discount;
};

module.exports = {
  foundDiscountCode,
  queryAllDiscountCodesWithShop,
  deleteDiscountCodesWithShop,
  updateDiscountCode,
};
