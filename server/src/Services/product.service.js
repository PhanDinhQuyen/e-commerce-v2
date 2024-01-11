const path = require("path");
const fs = require("fs");

const { ProductModel } = require("../Models/product.model");
const { BadRequestError } = require("../Handlers/error.handler");

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

  /**
   * Create a product of the specified type.
   * @param {Object} productData - Data for creating the product.
   * @param {string} productData.productType - The type of the product.
   * @returns {Promise} A promise that resolves to the created product.
   * @throws {BadRequestError} Throws an error if the product type is invalid.
   */
  static async createProduct({ productType, ...productData }) {
    if (!ProductService.productsRegistry[productType]) {
      throw new BadRequestError(`Invalid product type: ${productType}`);
    }

    const ProductClass = ProductService.productsRegistry[productType];
    const productInstance = new ProductClass({
      productType,
      ...productData,
    });
    return productInstance.create();
  }

  static async getProductsforShop({ auth }) {
    return await ProductModel.find({ auth }).lean();
  }

  static async getProductsforShopPublic({ auth }) {
    return await ProductModel.find({ auth, isPublic: true }).lean();
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
    return await ProductModel.create({ ...this, _id });
  }
}
// Work with Product extend methods
module.exports = Product; // Important line
// Auto-register product types
ProductService.autoRegisterProductTypes(
  path.join(__dirname, "./Stores"),
  ".service.js"
);

module.exports = ProductService;
