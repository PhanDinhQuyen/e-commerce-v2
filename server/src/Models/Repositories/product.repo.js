const { ProductModel } = require("../product.model");

const queryProducts = async (
  q = {},
  { l = 8, p = 1, s = "createdAt" } = {}
) => {
  const skip = (p - 1) * l;
  return await ProductModel.find(q)
    .sort(s)
    .skip(Math.max(skip, 0))
    .limit(l)
    .lean()
    .exec();
};

const queryProduct = async (query) => {
  return await ProductModel.findOne(query).lean().exec();
};

module.exports = {
  queryProducts,
  queryProduct,
};
