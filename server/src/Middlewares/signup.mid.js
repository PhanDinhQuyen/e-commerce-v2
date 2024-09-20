const Joi = require("joi");
const { BadRequestError } = require("../Handlers/error.handler");
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;
const schema = Joi.object({
  name: Joi.string().max(20).min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const validateSignup = (data) => {
  const result = schema.validate(data);
  if (result?.error) {
    throw new BadRequestError(result.error);
  }
  return result.value;
};

module.exports = validateSignup;
