const {
  CreateResponse,
  SuccessResponse,
} = require("../Handlers/success.handler");
const DiscountService = require("../Services/discount.service");

class DiscountController {
  static createDiscountCode = async (req, res) =>
    new CreateResponse(
      await DiscountService.createDiscountCode({ ...req.body, auth: req.auth })
    ).create(res);

  static getAllProductShopWithDiscount = async (req, res) =>
    new SuccessResponse(
      await DiscountService.getAllProductShopWithDiscount({
        ...req.body,
      })
    ).create(res);
}

module.exports = DiscountController;
