const { isValidObjectId, default: mongoose } = require("mongoose");
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
  return new mongoose.Types.ObjectId(id);
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

  for (const value of array) {
    if (Object.prototype.hasOwnProperty.call(object, value)) {
      data[value] = object[value];
    }
  }

  return data;
};

const handleInvalidData = (object) => {
  for (const key in object) {
    const value = object[key];

    const isNullOrUndefined = value === null || value === undefined;
    const isObject = typeof value === "object";

    if (isNullOrUndefined) {
      delete object[key];
    } else if (isObject) {
      handleInvalidData(value);
      if (Object.keys(value).length === 0) {
        delete object[key];
      }
    }
  }

  return object;
};

const updateNestedObjectParse = (object) => {
  const newObj = {};

  for (const key in object) {
    const value = object[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === "object") {
      const response = updateNestedObjectParse(value);
      for (const nestedKey in response) {
        newObj[`${key}.${nestedKey}`] = response[nestedKey];
      }
    } else {
      newObj[key] = value;
    }
  }

  return newObj;
};

const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

module.exports = {
  handlerCatchError,
  isObjectId,
  selectDataIntoObject,
  handleInvalidData,
  updateNestedObjectParse,
  isObjectEmpty,
};
