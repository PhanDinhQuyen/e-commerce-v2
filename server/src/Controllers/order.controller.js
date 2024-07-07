const { SuccessResponse } = require("../Handlers/success.handler");
const OrderService = require("../Services/order.service");

class OrderController {
  static createOrderUser = async (req, res) =>
    new SuccessResponse(await OrderService.createOrderUser(req.body)).create(
      res
    );
}

module.exports = OrderController;
