const Order = require("../../models/order.model");
const { generateTimeline } = require("../../utils/orderHelper");

// Helper to emit status updates
const emitStatusUpdate = (req, order, status) => {
  const io = req.app.get('io');
  if (io) {
    // Simple timeline generation for the specific event
    const updateData = {
      orderId: order._id,
      status: status,
      timestamp: new Date(),
      timeline: generateTimeline(order)
    };

    io.emit('orderStatusUpdate', updateData);
    console.log(`[SOCKET] Emitted status update: ${status} for Order ${order._id}`);
  }
};

// GET KDS ORDERS (Provider Dashboard)
exports.getKdsOrders = async (req, res) => {
  try {
    const providerId = req.user._id;

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
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      {
        status: "cooking",
        cookingStartedAt: new Date()
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found or access denied" });

    emitStatusUpdate(req, order, "cooking");
    res.json({ success: true, message: "Order Accepted & Cooking Started" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markReady = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      {
        status: "prepared",
        preparedAt: new Date()
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found or access denied" });

    emitStatusUpdate(req, order, "prepared");
    res.json({ success: true, message: "Order Ready & Prepared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markDispatched = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      {
        status: "out_for_delivery",
        outForDeliveryAt: new Date()
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found or access denied" });

    emitStatusUpdate(req, order, "out_for_delivery");
    res.json({ success: true, message: "Order Dispatched" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markDelivered = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      {
        status: "delivered",
        deliveredAt: new Date(),
        paymentStatus: "Paid"
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found or access denied" });

    emitStatusUpdate(req, order, "delivered");
    res.json({ success: true, message: "Order Delivered" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
