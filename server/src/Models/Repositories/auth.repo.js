const AuthModel = require("../auth.model");

const getAuthWithId = async (id) => await AuthModel.findById(id).lean().exec();

module.exports = { getAuthWithId };
