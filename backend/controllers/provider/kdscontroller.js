const Order = require("../../models/order.model");

// GET KDS ORDERS (Provider Dashboard)
exports.getKdsOrders = async (req, res) => {
  try {
    const providerId = req.user._id; // provider logged in

    const orders = await Order.find({
      provider: providerId,
      status: { $nin: ["delivered", "cancelled"] }
    })
      .populate("customer", "fullName")
      .sort({ createdAt: 1 });

    const response = {
      justIn: [],
      preparing: [],
      ready: [],
      dispatched: []
    };

    orders.forEach(order => {
      const orderCard = {
        _id: order._id,
        orderNo: order.orderNumber || order._id.toString().slice(-6),
        customerName: order.customer?.fullName,
        items: order.menuItems,
        status: order.status,
        orderTime: order.createdAt,
        orderType: order.orderType,
        quantity: order.quantity,
        amount: order.amount,
        paymentStatus: order.paymentStatus,
        customization: order.customization
      };

      if (order.status === "confirmed") {
        response.justIn.push(orderCard);
      } else if (order.status === "cooking") {
        response.preparing.push(orderCard);
      } else if (order.status === "prepared") {
        response.ready.push(orderCard);
      } else if (order.status === "out_for_delivery") {
        response.dispatched.push(orderCard);
      }
    });

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error("KDS Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load KDS orders"
    });
  }
};



exports.acceptOrder = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: "cooking",
    cookingStartedAt: new Date(),
    $push: { timeline: { status: "cooking", time: new Date() } }
  });

  res.json({ success: true, message: "Order Accepted & Cooking Started" });
};



exports.markReady = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: "prepared",
    preparedAt: new Date(),
    $push: { timeline: { status: "prepared", time: new Date() } }
  });

  res.json({ success: true, message: "Order Ready & Prepared" });
};



exports.markDispatched = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: "out_for_delivery",
    outForDeliveryAt: new Date(),
    $push: { timeline: { status: "out_for_delivery", time: new Date() } }
  });

  res.json({ success: true, message: "Order Dispatched" });
};
