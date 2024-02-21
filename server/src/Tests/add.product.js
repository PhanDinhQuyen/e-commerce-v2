const { faker } = require("@faker-js/faker");
// import { faker } from "faker-js/faker";
// import { ClothingModel, ElectronicModel } from "../Models/product.model";
const {
  ClothingModel,
  ElectronicModel,
  ProductModel,
} = require("../Models/product.model");
const getRandomType = () => {
  return Math.random() < 0.5 ? "Electronic" : "Clothing";
};

const getRandomAttributes = (type) => {
  if (type === "Electronic") {
    return {
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      color: faker.color.human(),
    };
  } else if (type === "Clothing") {
    return {
      brand: faker.vehicle.manufacturer(),
      size: faker.number.int({ min: 20, max: 50 }),
      material: faker.commerce.productMaterial(),
    };
  }
};
const typesModel = {
  Electronic: ElectronicModel,
  Clothing: ClothingModel,
};
const generateRandomProduct = async () => {
  const type = getRandomType();
  const attributes = getRandomAttributes(type);
  const addAttributes = await typesModel[type].create(attributes);

  return {
    _id: addAttributes._id,
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
};

async function add() {
  for (let i = 0; i < 10000; i++) {
    try {
      const product = await generateRandomProduct();
      await ProductModel.create(product);
    } catch (e) {
      console.log(e);
      break;
    }
  }
}

let radom = add();

module.exports = radom;
