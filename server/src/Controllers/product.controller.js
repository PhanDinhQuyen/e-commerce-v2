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
      await ProductService.getProductsforShop({ ...req.query, auth: req.auth })
    ).create(res);

  static getProductsforShopPublic = async (req, res) =>
    new SuccessResponse(
      await ProductService.getProductsforShopPublic(req.query)
    ).create(res);

  static getProduct = async (req, res) =>
    new SuccessResponse(await ProductService.getProduct(req.query._id)).create(
      res
    );
  static getProductManager = async (req, res) =>
    new SuccessResponse(
      await ProductService.getProductManager(req.query._id)
    ).create(res);

  static searchProducts = async (req, res) =>
    new SuccessResponse(await ProductService.searchProducts(req.query)).create(
      res
    );

  static publicProduct = async (req, res) =>
    new SuccessResponse(
      await ProductService.changePublicProduct({
        _id: req.query._id,
        auth: req.auth,
        _public: true,
      })
    ).create(res);

  static unPublicProduct = async (req, res) =>
    new SuccessResponse(
      await ProductService.changePublicProduct({
        _id: req.query._id,
        auth: req.auth,
        _public: false,
      })
    ).create(res);

  static updateProduct = async (req, res) =>
    new SuccessResponse(await ProductService.updateProduct(req.body)).create(
      res
    );
}
module.exports = ProductController;
