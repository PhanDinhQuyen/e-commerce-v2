const { default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
const DOCUMENT_REF_PRODUCT = "Product";
const DOCUMENT_REF_AUTH = "Auth";

/**
 * Represents the schema for the 'Inventory' document in the 'Inventories' collection.
 *
 * @typedef {Object} InventorySchema
 * @property {string} inventoryLocation - The location of the inventory.
 * @property {mongoose.Schema.Types.ObjectId} inventoryAuth - Reference to the 'Auth' document.
 * @property {mongoose.Schema.Types.ObjectId} inventoryProductId - Reference to the 'Product' document.
 * @property {number} inventoryStock - The stock quantity of the inventory.
 * @property {Array} inventoryReservation - An array to store reservations for the inventory.
 */

/**
 * Mongoose schema for the 'Inventory' document.
 *
 * @type {mongoose.Schema}
 */
const inventorySchema = new mongoose.Schema(
  {
    inventoryProductId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: DOCUMENT_REF_PRODUCT,
    },
    inventoryLocation: {
      type: String,
      default: "unknown",
    },
    inventoryStock: {
      type: Number,
      required: true,
    },
    inventoryAuth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DOCUMENT_REF_AUTH,
    },
    inventoryReservation: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

/**
 * Mongoose model for the 'Inventory' document.
 *
 * @type {import('mongoose').Model<InventorySchema>}
 */
const InventoryModel = mongoose.model(DOCUMENT_NAME, inventorySchema);

module.exports = InventoryModel;
