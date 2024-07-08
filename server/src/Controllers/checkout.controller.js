const CheckoutService = require("../Services/checkout.service");

class CheckoutController {
  static checkoutReview = async (req, res) => {
    new SuccessResponse(
      await CheckoutService.checkoutReview({ ...req.body, userId: req.auth })
    ).create(res);
  };
}

module.exports = CheckoutController;
