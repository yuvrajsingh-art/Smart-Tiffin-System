const Delivery = require("../models/delivery.model");

/**
 * CREATE DELIVERY
 * (Provider / Admin)
 */
exports.createDelivery = async (req, res) => {
  try {
    const { order,customer, provider, deliveryDate, expectedDeliveryTime, remark, } = req.body;

    // one delivery per order
    const already = await Delivery.findOne({ order });
    if (already) {
      return res.status(400).json({
        message: "Delivery already exists for this order",
      });
    }

    const delivery = await Delivery.create({
      order,
      customer,
      provider,
      deliveryDate,
      expectedDeliveryTime,
      remark,
      timeline: [
        {
          status: "Pending",
          note: "Delivery created",
        },
      ],
    });

    res.status(201).json({
      message: "Delivery created successfully",
      delivery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.status = status;
    delivery.timeline.push({
      status,
      note,
    });

    if (status === "Delivered") {
      delivery.deliveredAt = new Date();
    }

    await delivery.save();

    res.json({
      message: "Delivery status updated",
      delivery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCustomerDeliveries = async (req, res) => {
  try {
    const customerId = req.user._id;

    const deliveries = await Delivery.find({ customer: customerId })
      .sort({ deliveryDate: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProviderDeliveries = async (req, res) => {
  try {
    const providerId = req.user._id;

    const deliveries = await Delivery.find({ provider: providerId })
      .sort({ deliveryDate: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.cancelDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.status = "Cancelled";
    delivery.timeline.push({
      status: "Cancelled",
      note: "Delivery cancelled",
    });

    await delivery.save();

    res.json({
      message: "Delivery cancelled",
      delivery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("customer", "name email")
      .populate("provider", "name email")
      .sort({ deliveryDate: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateMultipleDeliveries = async (req, res) => {
  try {
    const { deliveryIds, status, note } = req.body;

    if (!deliveryIds || deliveryIds.length === 0) {
      return res.status(400).json({ message: "No delivery IDs provided" });
    }

    const deliveries = await Delivery.find({
      _id: { $in: deliveryIds },
    });

    for (let d of deliveries) {
      d.status = status;
      d.timeline.push({
        status,
        note,
      });

      if (status === "Delivered") {
        d.deliveredAt = new Date();
      }

      await d.save();
    }

    res.json({
      message: "Selected deliveries updated",
      total: deliveries.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
