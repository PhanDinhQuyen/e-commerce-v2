const { BadRequestError } = require("../../Handlers/error.handler");
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

const querySearchProducts = async (query) => {
  return await ProductModel.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .lean()
    .exec();
};

const publicProductForShop = async (_id, auth) => {
  const product = await ProductModel.findOne({ _id, auth }).lean().exec();
  if (!product) {
    throw new BadRequestError("Product not found");
  }
  const updateProduct = await ProductModel.findOneAndUpdate(
    { _id },
    { isPublic: true },
    { new: true }
  );

  return updateProduct;
};

module.exports = {
  queryProducts,
  queryProduct,
  querySearchProducts,
  publicProductForShop,
};
