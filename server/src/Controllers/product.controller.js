const {
  CreateResponse,
  SuccessResponse,
} = require("../Handlers/success.handler");
const ProductService = require("../Services/product.service");
class ProductController {
  static createProduct = async (req, res) =>
    new CreateResponse(
      await ProductService.createProduct({ ...req.body, auth: req.auth })
    ).create(res);

  static getProductsforShop = async (req, res) =>
    new SuccessResponse(
      await ProductService.getProductsforShop(req.query)
    ).create(res);
}
module.exports = ProductController;
