const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
const { default: mongoose } = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],
    orderTotal: Number,
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    },
    orderUser: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    orderAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    orderPayment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    orderInvoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    orderShipping: { type: mongoose.Schema.Types.ObjectId, ref: "Shipping" },
    orderRefund: { type: mongoose.Schema.Types.ObjectId, ref: "Refund" },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const OrderModel = mongoose.model(DOCUMENT_NAME, orderSchema);

module.exports = OrderModel;
