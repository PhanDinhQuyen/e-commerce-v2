const ProductController = require("../Controllers/product.controller");
const { handlerCatchError } = require("../Utils");

const Role = require("../Auth/verify.role");
const Auth = require("../Auth/verify.auth");
const route = require("express").Router();

route.get(
  "/get/public",
  handlerCatchError(ProductController.getProductsforShopPublic)
);
route.get("/get", handlerCatchError(ProductController.getProduct));
route.get("/search", handlerCatchError(ProductController.searchProducts));

route.post(
  "/create",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.createProduct)
);

route.get(
  "/manager/get/all",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.getProductsforShop)
);
route.get(
  "/manager/get",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.getProductManager)
);
route.post(
  "/manager/public",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.publicProduct)
);

route.post(
  "/manager/unpublic",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.unPublicProduct)
);

route.post(
  "/manager/public",
  handlerCatchError(Auth.verifyAccessToken),
  handlerCatchError(Role.verifyShop),
  handlerCatchError(ProductController.updateProduct)
);

route.post(
  "/manager/update/:_id",
  handlerCatchError(ProductController.updateProduct)
);

module.exports = route;
