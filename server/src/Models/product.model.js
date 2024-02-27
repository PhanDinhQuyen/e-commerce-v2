const { default: mongoose } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const DOCUMENT_REF = "Auth";

const productSchema = new mongoose.Schema(
  {
    productName: String,
    productSlug: String,
    productThumb: String,

    productPrice: Number,
    productDescription: String,
    productType: {
      type: String,
      enum: ["Electronic", "Clothing"],
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    productAttributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    productRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    productVariations: { type: Array, default: [] },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
      // select: false,
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DOCUMENT_REF,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

productSchema.pre("save", async function (next) {
  this.productSlug = slugify(this.productName, { lower: true });
  next();
});

productSchema.index({
  productName: "text",
  productSlug: "text",
  productDescription: "text",
});

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
  },
  {
    timestamps: true,
    collection: "Clothings",
  }
);

const electronicSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String },
    color: { type: String },
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

const ProductModel = mongoose.model(DOCUMENT_NAME, productSchema);
const ClothingModel = mongoose.model("Clothing", clothingSchema);
const ElectronicModel = mongoose.model("Electronic", electronicSchema);

module.exports = {
  ProductModel,
  ClothingModel,
  ElectronicModel,
};
