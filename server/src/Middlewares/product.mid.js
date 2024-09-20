const Joi = require("joi");
const { BadRequestError } = require("../Handlers/error.handler");

const schemaCreateProduct = Joi.object({
  productName: Joi.string().min(3).max(30).required(),
  productThumb: Joi.string().required(),
  productPrice: Joi.number().required(),
  productDescription: Joi.string().max(100).optional(),
  productType: Joi.string().valid("Electronic", "Clothing").required(),
  productQuantity: Joi.number().required(),
  productAttributes: Joi.when("productType", {
    is: "Electronic",
    then: Joi.object({
      brand: Joi.string().max(50).required(),
      model: Joi.string().optional(),
      color: Joi.string().optional(),
    }).required(),
    otherwise: Joi.object({
      brand: Joi.string().max(50).required(),
      size: Joi.string().optional(),
      material: Joi.string().optional(),
    }).required(),
  }),
  productVariations: Joi.array().optional(),
});
const validateCreateProduct = (data) => {
  const result = schemaCreateProduct.validate(data);
  if (result?.error) {
    throw new BadRequestError(result.error);
  }
  return result.value;
};

module.exports = validateCreateProduct;
