const {
  ProductModel,
  ClothingModel,
  ElectronicModel,
} = require("../Models/product.model");
const { BadRequestError } = require("../Handlers/error.handler");

class ProductFactory {
  static productsRegistry = {};

  static registryProductType(type, classRef) {
    ProductFactory.productsRegistry[type] = classRef;
  }

  static async createProduct({ productType, ...productData }) {
    if (!Object.keys(this.productsRegistry).includes(productType)) {
      throw new BadRequestError(`Invalid product type: ${productType}`);
    }

    const productInstance = new this.productsRegistry[productType]({
      productType,
      ...productData,
    });

    return productInstance.create();
  }
}

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

  async create(_id) {
    return await ProductModel.create({ ...this, _id });
  }
}

class Clothing extends Product {
  async create() {
    const newClothing = await ClothingModel.create(this.productAttributes);
    if (!newClothing) {
      throw new BadRequestError("Can't create new clothing");
    }

    const newProduct = await super.create(newClothing._id);
    if (!newProduct) {
      await ClothingModel.findByIdAndDelete(newClothing._id);
      throw new BadRequestError("Can't create new product");
    }

    return newProduct;
  }
}

class Electronic extends Product {
  async create() {
    const newElectronic = await ElectronicModel.create(this.productAttributes);
    if (!newElectronic) {
      throw new BadRequestError("Can't create new electronic");
    }

    const newProduct = await super.create(newElectronic._id);
    if (!newProduct) {
      await newElectronic.findByIdAndDelete(newElectronic._id);
      throw new BadRequestError("Can't create new product");
    }

    return newProduct;
  }
}

ProductFactory.registryProductType("Clothing", Clothing);
ProductFactory.registryProductType("Electronic", Electronic);

module.exports = ProductFactory;
