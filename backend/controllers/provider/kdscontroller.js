const Order = require("../../models/order.model");

// GET KDS ORDERS (Provider Dashboard)
exports.getKdsOrders = async (req, res) => {
  try {
    const providerId = req.user._id; // provider logged in

    const orders = await Order.find({
      provider: providerId,
      meal_type: "lunch", // optional (UI says Lunch Service)
      status: { $ne: "Cancelled" }
    })
      .populate("customer", "name")
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
        orderNo: order._id.toString().slice(-4),
        customerName: order.customer?.name,
        items: order.items,
        status: order.status,
        orderTime: order.createdAt,
        order_type: order.order_type,
        grandTotal: order.grandTotal
      };

      if (order.status === "Placed") {
        response.justIn.push(orderCard);
      }

      if (["Accepted", "Preparing"].includes(order.status)) {
        response.preparing.push(orderCard);
      }

      if (order.status === "Ready") {
        response.ready.push(orderCard);
      }

      if (order.status === "Picked_Up") {
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
    status: "Accepted",
    $push: { timeline: { status: "Accepted", time: new Date() } }
  });

  res.json({ success: true, message: "Order Accepted" });
};



exports.markReady = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: "Ready",
    preparedAt: new Date(),
    $push: { timeline: { status: "Ready", time: new Date() } }
  });

  res.json({ success: true, message: "Order Ready" });
};



exports.markDispatched = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: "Picked_Up",
    $push: { timeline: { status: "Picked_Up", time: new Date() } }
  });

  res.json({ success: true, message: "Order Dispatched" });
};
