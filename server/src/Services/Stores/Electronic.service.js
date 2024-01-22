const { default: mongoose } = require("mongoose");
const { ElectronicModel } = require("../../Models/product.model");

const { BadRequestError } = require("../../Handlers/error.handler");
const { Product } = require("../product.service");

/**
 * Class for creating electronic products.
 */
class Electronic extends Product {
  /**
   * Create a new electronic product.
   * @returns {Promise} A promise that resolves to the created electronic product.
   * @throws {BadRequestError} Throws an error if creation fails.
   */
  async create() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newElectronic = await ElectronicModel.create(
        this.productAttributes
      );
      if (!newElectronic) {
        throw new BadRequestError("Can't create new electronic");
      }

      await newElectronic.save({ session });
      const newProduct = await super.create(newElectronic._id);

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
    session.startTransaction();
    try {
      const objectParams = handleInvalidData(this);

      if (objectParams.productAttributes) {
        await updateProductById({
          _id,
          payload: objectParams.productAttributes,
          model: ElectronicModel,
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

module.exports = { Electronic };
