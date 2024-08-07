const { default: mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
const DOCUMENT_REF_AUTH = "Auth";

const productCart = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
    productAttributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const cartProducts = new mongoose.Schema(
  {
    productShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    products: { type: [productCart], required: true, default: [] },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    cartState: {
      type: String,
      required: true,
      enum: ["active", "pending", "failed", "completed"],
      default: "active",
    },
    cartProducts: {
      type: [cartProducts],
      required: true,
      default: [],
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
