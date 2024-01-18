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

const querySearchProducts = async (query, isPublic = true) => {
  return await ProductModel.find(
    { $text: { $search: query }, isPublic },
    { score: { $meta: "textScore" } }
  )
    .lean()
    .exec();
};

const changePublicProductForShop = async (_id, auth, isPublic) => {
  const product = await ProductModel.findOne({ _id, auth }).lean().exec();

  if (!product) {
    throw new BadRequestError("Product not found");
  }
  console.log(isPublic);
  if (product.isPublic === isPublic) {
    const errorText = isPublic
      ? "Product is already public"
      : "Product is already unpublic";
    throw new BadRequestError(errorText);
  }

  const updateProduct = await ProductModel.findOneAndUpdate(
    { _id },
    { isPublic },
    { new: true }
  );

  return updateProduct;
};

module.exports = {
  queryProducts,
  queryProduct,
  querySearchProducts,
  changePublicProductForShop,
};
