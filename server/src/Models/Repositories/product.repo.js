const { BadRequestError } = require("../../Handlers/error.handler");
const { isObjectId } = require("../../Utils");
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
  if (query.length < 3) {
    throw new BadRequestError(`Query must be greater than 3`);
  }
  const matchStage = {
    $text: { $search: query },
    isPublic,
  };
  const sortStage = { score: { $meta: "textScore" } };
  return await ProductModel.find(matchStage, sortStage)
    .sort(sortStage)
    .limit(5)
    .lean()
    .exec();
};

const changePublicProductForShop = async (_id, auth, isPublic) => {
  const product = await ProductModel.findOne({ _id, auth }).lean().exec();

  if (!product) {
    throw new BadRequestError("Product not found");
  }

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

const updateProductById = async ({
  _id,
  payload,
  model,
  isNew = true,
  session,
}) => {
  return await model.findByIdAndUpdate(_id, payload, { new: isNew, session });
};

const checkProductsServer = async (products, auth, isPublic = true) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await queryProduct({
        auth,
        _id: isObjectId(product.productId),
        isPublic,
      });
      if (!foundProduct) {
        throw new BadRequestError("Checkout product error");
      }
      return {
        productId: product.productId,
        productPrice: foundProduct.productPrice,
        productQuantity: product.productQuantity,
      };
    })
  );
};

module.exports = {
  queryProducts,
  queryProduct,
  querySearchProducts,
  changePublicProductForShop,
  updateProductById,
  checkProductsServer,
};
