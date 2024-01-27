const { CreateResponse } = require("../Handlers/success.handler");
const DiscountService = require("../Services/discount.service");

class DiscountController {
  static createDiscountCode = async (req, res) =>
    new CreateResponse(
      await DiscountService.createDiscountCode(req.body)
    ).create(res);
}

module.exports = DiscountController;
