const Joi = require("joi");
const { BadRequestError } = require("../Handlers/error.handler");

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com"] } })
    .required(),
  password: Joi.string().min(8).required(),
});

const validateSignin = (data) => {
  console.log({ data });
  const result = schema.validate(data);

  if (result?.error) {
    throw new BadRequestError(result.error);
  }

  return result.value;
};

module.exports = validateSignin;
