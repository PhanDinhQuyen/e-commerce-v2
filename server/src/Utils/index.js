const { isValidObjectId } = require("mongoose");
const { BadRequestError } = require("../Handlers/error.handler");

/**
 * Wraps an asynchronous function with error handling middleware.
 *
 * @param {function} func - The asynchronous function to be wrapped.
 * @returns {function} - Express middleware with error handling.
 */
const handlerCatchError = (func) => (req, res, next) =>
  func(req, res, next).catch(next);

/**
 * Validates if the provided ID is a valid MongoDB ObjectId.
 * Throws a BadRequestError if the ID is invalid.
 *
 * @param {string} id - The ID to be validated.
 * @returns {string} - The validated ObjectId.
 * @throws {BadRequestError} - If the ID is not a valid ObjectId.
 */
const isObjectId = (id) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError();
  }
  return id;
};

/**
 * Selects specific properties from an object and creates a new object with those properties.
 *
 * @param {string[]} array - An array of property names to be selected.
 * @param {Object} object - The source object from which properties will be selected.
 * @returns {Object} - A new object containing selected properties.
 */
const selectDataIntoObject = (array, object) => {
  const data = {};
  console.log("Object:", object);

  for (const value of array) {
    if (Object.prototype.hasOwnProperty.call(object, value)) {
      data[value] = object[value];
    }
  }

  return data;
};

const handleInvalidData = (object) => {
  for (const key in object) {
    console.log(object[key]);
  }
  return object;
};

console.log(handleInvalidData({ 1: null, 2: 3, 3: { 1: 2 } }));

module.exports = {
  handlerCatchError,
  isObjectId,
  selectDataIntoObject,
};
