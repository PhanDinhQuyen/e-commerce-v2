const { faker } = require("@faker-js/faker");
// import { faker } from "faker-js/faker";
// import { ClothingModel, ElectronicModel } from "../Models/product.model";
const slugify = require("slugify");
const {
  ClothingModel,
  ElectronicModel,
  ProductModel,
} = require("../Models/product.model");
const ProductService = require("../Services/product.service");
const getRandomType = () => {
  return Math.random() < 0.5 ? "Electronic" : "Clothing";
};
const typesModel = {
  Electronic: ElectronicModel,
  Clothing: ClothingModel,
};

const getRandomAttributes = (type) => {
  const types = {
    Electronic: {
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      color: faker.color.human(),
    },
    Clothing: {
      brand: faker.vehicle.manufacturer(),
      size: faker.number.int({ min: 20, max: 50 }),
      material: faker.commerce.productMaterial(),
    },
  };
  return types[type];
};
const generateRandomProduct = async () => {
  const type = getRandomType();
  const attributes = getRandomAttributes(type);
  // const addAttributes = await typesModel[type].create(attributes);

  const product = {
    // _id: addAttributes._id,
    productName: faker.commerce.productName(),
    productThumb: faker.image.url(),
    productPrice: faker.commerce.price(),
    productDescription: faker.lorem.sentence(),
    productType: type,
    productQuantity: faker.number.int({ min: 1, max: 1000 }),
    productAttributes: attributes,
    productRating: faker.number.float({ min: 1, max: 5 }),
    isPublic: faker.datatype.boolean(faker.number.float({ min: 0, max: 1 })),
    auth: "659cea7e6f7103b1f95fc663", // Replace with an actual user ID if needed
  };
  // product.productSlug = slugify(product.productName);
  return product;
};

async function addRandomProductToDB() {
  let batchSize = 500;
  let breakCount = 0;
  for (let i = 0; i < 2000; i += batchSize) {
    for (let j = 0; j < batchSize; j++) {
      try {
        const product = await generateRandomProduct();
        await ProductService.createProduct(product);
      } catch (error) {
        breakCount++;
        break;
      }
    }
  }
  console.log(breakCount);
  return "Ok";
}

module.exports = addRandomProductToDB();
