const { CreateResponse } = require("../Handlers/success.handler");
const ProductService = require("../Services/product.service");
class ProductController {
  static createProduct = async (req, res) =>
    new CreateResponse(await ProductService.createProduct(req.body)).create(
      res
    );
}
module.exports = ProductController;
