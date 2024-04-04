const { BadRequestError } = require("../Handlers/error.handler");

const validateDiscountPayload = (payload) => {
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
  } = payload;

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
  if (!["fixedAmount", "percentage"].includes(discountType)) {
    throw new BadRequestError("Invalid discountType value");
  }
  if (!["all", "specified"].includes(discountAppliesTo)) {
    throw new BadRequestError("Invalid discountType value");
  }

  const startDate = new Date(discountStartDate);
  const endDate = new Date(discountEndDate);
  const now = Date.now();
  if (now > startDate || now > endDate) {
    throw new BadRequestError();
  }

  if (startDate >= endDate) {
    throw new BadRequestError(
      "Invalid date range. discountStartDate must be before discountEndDate"
    );
  }
};

module.exports = validateDiscountPayload;
