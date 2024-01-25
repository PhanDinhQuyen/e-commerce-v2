const { BadRequestError } = require("../Handlers/error.handler");

const validateDiscountPayload = (req, res, next) => {
  const {
    discountName,
    discountDescription,
    discountType,
    discountValue,
    discountCode,
    discountStartDate,
    discountEndDate,
    discountQuanlityUsed,
    discountUsersUsed,
    discountMaxUsePerUser,
    discountMinOrderValue,
    discountAppliesTo,
    discountProducts,
    discountStatus,
  } = req.body;

  // Check if required fields are present
  if (
    !discountName ||
    !discountType ||
    !discountValue ||
    !discountCode ||
    !discountStartDate ||
    !discountEndDate ||
    !discountQuanlityUsed ||
    !discountMinOrderValue ||
    !discountAppliesTo
  ) {
    throw new BadRequestError("Missing required fields");
  }

  // Check discountType enum values
  if (discountType !== "fixedAmount" && discountType !== "percentage") {
    throw new BadRequestError("Invalid discountType value");
  }

  // Check discountAppliesTo enum values
  if (discountAppliesTo !== "all" && discountAppliesTo !== "specified") {
    throw new BadRequestError("Invalid discountAppliesTo value");
  }

  // Check if discountStartDate is before discountEndDate
  const startDate = new Date(discountStartDate);
  const endDate = new Date(discountEndDate);

  if (startDate >= endDate) {
    throw new BadRequestError(
      "Invalid date range. discountStartDate must be before discountEndDate"
    );
  }

  next();
};

module.exports = validateDiscountPayload;
