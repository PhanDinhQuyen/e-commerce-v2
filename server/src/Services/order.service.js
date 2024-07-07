class OrderService {
  static async createOrderUser() {
    return {
      status: "pending",
      orderItems: [],
      totalAmount: 0,
      deliveryAddress: {},
      paymentMethod: {},
      shippingMethod: {},
      customer: {},
    };
  }
}

module.exports = OrderService;
