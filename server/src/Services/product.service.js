const path = require("path");
const fs = require("fs");

const { ProductModel } = require("../Models/product.model");
const {
  BadRequestError,
  UnAuthorizedError,
} = require("../Handlers/error.handler");
const {
  queryProducts,
  queryProduct,
  querySearchProducts,
  changePublicProductForShop,
  updateProductById,
} = require("../Models/Repositories/product.repo");
const { isObjectId } = require("../Utils");
const InventoryModel = require("../Models/inventory.model");

/**
 * Service class (Factory parttent) for creating different types of products
 */
class ProductService {
  /**
   * Registry to store product types and their corresponding classes.
   * @type {Object.<string, Function>}
   */
  static productsRegistry = {};

  /**
   * Register a product type with its corresponding class.
   * @param {string} type - The type of the product.
   * @param {Function} classRef - The class reference for the product type.
   */
  static async registryProductType(type, classRef) {
    ProductService.productsRegistry[type] = classRef;
  }

  /**
   * Automatically register product types from a directory.
   * @param {string} directoryPath - The path to the directory containing product type files.
   * @param {string} subfix - The file suffix to filter files.
   */
  static async autoRegisterProductTypes(directoryPath, subfix) {
    const files = fs.readdirSync(directoryPath);

    files.forEach((fileName) => {
      if (fileName.endsWith(subfix)) {
        const module = require(path.join(directoryPath, fileName));
        const className = Object.keys(module)[0];
        const classRef = module[className];
        ProductService.registryProductType(className, classRef);
      }
    });
  }
  static checkProductType(productType) {
    if (!ProductService.productsRegistry[productType]) {
      throw new BadRequestError(`Invalid product type: ${productType}`);
    }

    const ProductClass = ProductService.productsRegistry[productType];
    return ProductClass;
  }
  /**
   * Create a product of the specified type.
   * @param {Object} productData - Data for creating the product.
   * @param {string} productData.productType - The type of the product.
   * @returns {Promise} A promise that resolves to the created product.
   * @throws {BadRequestError} Throws an error if the product type is invalid.
   */
  static async createProduct({ productType, ...productData }) {
    const ProductClass = this.checkProductType(productType);
    const productInstance = new ProductClass({
      productType,
      ...productData,
    });
    return productInstance.create();
  }

  static async getProductsforShop({ auth, page, sort }) {
    return await queryProducts({ auth }, { p: page, s: sort });
  }

  static async getProductsforShopPublic({ auth, page }) {
    return await queryProducts({ auth, isPublic: true }, { p: page });
  }

  static async getProduct(_id) {
    return await queryProduct({ _id, isPublic: true });
  }
  static async getProductManager(_id) {
    return await queryProduct({ _id });
  }
  static async searchProducts({ query }) {
    return await querySearchProducts(query);
  }
  static async changePublicProduct({ _id, auth, _public }) {
    return await changePublicProductForShop(_id, auth, _public);
  }

  static async updateProduct({ _id, payload, auth }) {
    const { productType } = payload;
    isObjectId(_id);
    const productHolder = await queryProduct({ _id });
    if (!productHolder) {
      throw new BadRequestError("Product not found");
    }
    if (productHolder.auth.toString() !== auth) {
      throw new UnAuthorizedError();
    }

    const ProductClass = this.checkProductType(productType);
    const productInstance = new ProductClass(payload);

    return productInstance.updateProduct(_id);
  }
}

/**
 * Base class for all products.
 */
class Product {
  constructor({
    productName,
    productQuantity,
    productPrice,
    productDescription,
    productAttributes,
    productThumb,
    productType,
    auth,
  }) {
    this.productName = productName;
    this.productQuantity = productQuantity;
    this.productPrice = productPrice;
    this.productDescription = productDescription;
    this.productAttributes = productAttributes;
    this.productThumb = productThumb;
    this.productType = productType;
    this.auth = auth;
  }

  /**
   * Create a new product.
   * @param {string} _id - The ID of the product.
   * @returns {Promise} A promise that resolves to the created product.
   */
  async create(_id) {
    const product = await ProductModel.create({ ...this, _id });
    if (product) {
      await InventoryModel.create({
        inventoryProductId: _id,
        inventoryAuth: this.auth,
        inventoryStock: this.productQuantity,
      });
    }
    return product;
  }
  async update({ _id, payload, session }) {
    return await updateProductById({
      _id,
      payload,
      model: ProductModel,
      session,
    });
  }
}
// Work with Product extend methods
module.exports = { Product }; // Important line
// Auto-register product types
ProductService.autoRegisterProductTypes(
  path.join(__dirname, "./Stores"),
  ".service.js"
);

module.exports = ProductService;
