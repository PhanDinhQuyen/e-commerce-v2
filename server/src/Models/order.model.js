const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
const { default: mongoose } = require("mongoose");

const orderCheckOutSchema = new mongoose.Schema(
  {
    totalPrice: Number,
    feeShip: Number,
    totalDiscount: Number,
    totalCheckout: Number,
  },
  {
    _id: false,
    versionKey: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: Array,
      default: [],
    },
    orderCheckOut: orderCheckOutSchema,
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderUser: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    orderAddress: { type: Object, default: {} },
    orderPayment: { type: Object, default: {} },
    orderTrackingNumber: { type: Number, default: "#000012082024" },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const OrderModel = mongoose.model(DOCUMENT_NAME, orderSchema);

module.exports = OrderModel;
