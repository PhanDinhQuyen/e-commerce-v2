const { default: mongoose } = require("mongoose");
const { ClothingModel } = require("../../Models/product.model");
const { BadRequestError } = require("../../Handlers/error.handler");
const { Product } = require("../product.service");
const {
  handleInvalidData,
  updateNestedObjectParse,
  isObjectEmpty,
} = require("../../Utils");
const { updateProductById } = require("../../Models/Repositories/product.repo");

/**
 * Class for creating clothing products.
 */
class Clothing extends Product {
  /**
   * Create a new clothing product.
   * @returns {Promise} A promise that resolves to the created clothing product.
   * @throws {BadRequestError} Throws an error if creation fails.
   */
  async create() {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const newClothing = await ClothingModel.create(this.productAttributes);
      if (!newClothing) {
        throw new BadRequestError("Can't create new clothing");
      }

      await newClothing.save({ session });
      const newProduct = await super.create(newClothing._id);

      if (!newProduct) {
        throw new BadRequestError("Can't create new product");
      }

      await session.commitTransaction();
      return newProduct;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestError(error.message);
    } finally {
      await session.endSession();
    }
  }

  async updateProduct(_id) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const objectParams = updateNestedObjectParse(this);
      delete objectParams.productType;
      if (isObjectEmpty(objectParams)) {
        throw new BadRequestError("No thing to update");
      }

      if (objectParams.productAttributes) {
        await updateProductById({
          _id,
          payload: objectParams.productAttributes,
          model: ClothingModel,
          session,
        });
      }

      const product = await super.update({
        _id,
        payload: objectParams,
        session,
      });
      await session.commitTransaction();
      return product;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestError(error.message);
    } finally {
      await session.endSession();
    }
  }
}

module.exports = { Clothing };
