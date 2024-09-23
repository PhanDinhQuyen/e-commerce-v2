const { BadRequestError } = require("../Handlers/error.handler");

// const validateDiscountPayload = (payload) => {
//   const {
//     discountName,
//     discountDescription,
//     discountType,
//     discountValue,
//     discountCode,
//     discountStartDate,
//     discountEndDate,
//     discountQuanlityUsed,
//     discountUsersUsed,
//     discountMaxUsePerUser,
//     discountMinOrderValue,
//     discountAppliesTo,
//     discountProducts,
//     discountStatus,
//   } = payload;

//   if (
//     !discountName ||
//     !discountType ||
//     !discountValue ||
//     !discountCode ||
//     !discountStartDate ||
//     !discountEndDate ||
//     !discountQuanlityUsed ||
//     !discountMinOrderValue ||
//     !discountAppliesTo
//   ) {
//     throw new BadRequestError("Missing required fields");
//   }
//   if (!["fixedAmount", "percentage"].includes(discountType)) {
//     throw new BadRequestError("Invalid discountType value");
//   }
//   if (!["all", "specified"].includes(discountAppliesTo)) {
//     throw new BadRequestError("Invalid discountType value");
//   }

//   const startDate = new Date(discountStartDate);
//   const endDate = new Date(discountEndDate);
//   const now = Date.now();
//   if (now > endDate) {
//     throw new BadRequestError("Date invalid");
//   }

//   if (startDate >= endDate) {
//     throw new BadRequestError(
//       "Invalid date range. discountStartDate must be before discountEndDate"
//     );
//   }
// };

const Joi = require("joi");

const discountSchema = Joi.object({
  discountName: Joi.string().max(50).required(),
  discountDescription: Joi.string().max(255).optional(),
  discountType: Joi.string().valid("fixedAmount", "percentage").required(),
  discountValue: Joi.number().required(),
  discountCode: Joi.string().max(20).optional(),
  discountStartDate: Joi.date().required(),
  discountEndDate: Joi.date()
    .greater(Joi.ref("discountStartDate"))
    .required()
    .messages({
      "date.greater":
        "Invalid date range. discountStartDate must be before discountEndDate",
    }),
  discountQuanlityUsed: Joi.number().integer().min(0).required(),
  discountUsersUsed: Joi.array().optional(),
  discountMaxUsePerUser: Joi.number().integer().min(0).required(),
  discountMinOrderValue: Joi.number().required(),
  discountAppliesTo: Joi.string().valid("all", "specified").required(),
  discountProducts: Joi.array().items(Joi.string()).optional(),
  discountStatus: Joi.bool().required(),
})
  .custom((value, helpers) => {
    const now = Date.now();
    const { discountEndDate } = value;

    if (now > new Date(discountEndDate)) {
      return helpers.error("date.invalid", {
        message: "Discount end date has passed.",
      });
    }

    return value;
  })
  .messages({
    "date.invalid": "Date invalid. The discountEndDate must be in the future.",
  });

const validateDiscount = (data) => {
  const result = discountSchema.validate(data);
  console.log(result);
  if (result?.error) {
    throw new BadRequestError(result.error);
  }

  return result.value;
};

module.exports = validateDiscount;

// module.exports = validateDiscountPayload;
