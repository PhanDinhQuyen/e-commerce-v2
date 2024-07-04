const { default: mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
const DOCUMENT_REF_AUTH = "Auth";

const cartProducts = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productShopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    cartState: {
      type: String,
      required: true,
      enum: ["active", "pending", "failed", "completed"],
      default: "active",
    },
    cartProducts: {
      type: Array,
      required: true,
      default: [],
    },
    cartCountProducts: {
      type: Number,
      required: true,
      default: 0,
    },
    cartUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: DOCUMENT_REF_AUTH,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const CartModel = mongoose.model(DOCUMENT_NAME, cartSchema);

module.exports = CartModel;
