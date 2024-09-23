const TokenV2Model = require("../token.v2.model");

const getPublicKeyWithAuth = async (auth) =>
  await TokenV2Model.findOne({ auth }).lean().exec();

const storageToken = async (filter, update, options) =>
  await TokenV2Model.findOneAndUpdate(filter, update, options).lean().exec();

const removeTokenWithAuth = async (auth) =>
  await TokenV2Model.findOneAndDelete({ auth }).lean().exec();

module.exports = { getPublicKeyWithAuth, storageToken, removeTokenWithAuth };
