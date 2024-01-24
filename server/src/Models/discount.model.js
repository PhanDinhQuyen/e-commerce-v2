const { default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
const DOCUMENT_REF = "Auth";

const discountSchema = new mongoose.Schema(
  {
    discountName: { type: String, required: true },
    discountDescription: String,
    discountType: {
      type: String,
      required: true,
      enum: ["fixedAmount", "percentage"],
    },
    discountValue: { type: Number, required: true },
    discountCode: { type: String, required: true },
    discountStartDate: { type: Date, required: true },
    discountEndDate: { type: Date, required: true },
    discountQuanlityUsed: { type: Number, required: true },
    discountUsersUsed: { type: Array, default: [] },
    discountMaxUsePerUser: { type: Number, default: 1 },
    discountMinOrderValue: { type: Number, required: true },
    discountAppliesTo: {
      type: String,
      required: true,
      enum: ["all", "specified"],
    },
    discountProducts: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    discountStatus: {
      type: Boolean,
      default: true,
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DOCUMENT_REF,
      required: true,
    },
  },
  { collection: COLLECTION_NAME, timestamps: true }
);

const DiscountModel = mongoose.model(DOCUMENT_NAME, discountSchema);

module.exports = DiscountModel;
