const { default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Token";
const COLLECTION_NAME = "Tokens";
const DOCUMENT_REF = "Auth";

/**
 * Represents the schema for the 'Token' document in the 'Tokens' collection.
 *
 * @typedef {Object} TokenSchema
 * @property {string} privateKey - The private key associated with the token.
 * @property {string} publicKey - The public key associated with the token.
 * @property {Array} refreshTokensUsed - An array of used refresh tokens (default: []).
 * @property {mongoose.Schema.Types.ObjectId} auth - Reference to the 'Auth' document.
 */

const tokenSchema = new mongoose.Schema(
  {
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: DOCUMENT_REF,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

/**
 * Mongoose model for the 'Token' document.
 *
 * @type {import('mongoose').Model<TokenSchema>}
 */
const TokenModel = mongoose.model(DOCUMENT_NAME, tokenSchema);

module.exports = TokenModel;
