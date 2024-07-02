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
      await DiscountService.getAllProductShopWithDiscount({ ...req.body })
    ).create(res);
  static getAllDiscountCodeWithShop = async (req, res) =>
    new SuccessResponse(
      await DiscountService.getAllDiscountCodesByShop(req.body)
    ).create(res);
  static getDiscountAmount = async (req, res) =>
    new SuccessResponse(
      await DiscountService.getDiscountAmount({ ...req.body, auth: req.auth })
    ).create(res);
  static cancelDiscountCode = async (req, res) =>
    new SuccessResponse(
      await DiscountService.cancelDiscountCode({ ...req.body, auth: req.auth })
    ).create(res);
  static deleteDiscount = async (req, res) =>
    new SuccessResponse(
      await DiscountService.deleteDiscount({
        auth: req.auth,
        discountCode: req.body.discountCode,
      })
    ).create(res);
}

module.exports = DiscountController;
