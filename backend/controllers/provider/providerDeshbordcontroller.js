const Order = require("../../models/order.model");
const Provider = require("../../models/providerprofile.model");
const Subscription = require("../../models/subscription.model");
// const Inventory = require("../../models/inventory.model"); // later

exports.getProviderDashboard = async (req, res) => {
  try {
    const providerId = req.user.id;

    /* ---------------- LIVE OPERATIONS ---------------- */

    const ordersToPrep = await Order.countDocuments({
      provider: providerId,
      status: { $in: ["confirmed", "cooking"] }
    });

    const readyForPickup = await Order.countDocuments({
      provider: providerId,
      status: "prepared"
    });

    const outForDelivery = await Order.countDocuments({
      provider: providerId,
      status: "out_for_delivery"
    });

    /* ---------------- TODAY REVENUE ---------------- */

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Get all delivered orders for today
    const deliveredOrders = await Order.find({
      provider: providerId,
      status: "delivered",
      createdAt: { $gte: startOfDay }
    }).select("amount paymentMethod");

    let totalRevenue = 0;
    let online = 0;
    let cash = 0;

    deliveredOrders.forEach(order => {
      const amount = order.amount || 0;
      totalRevenue += amount;
      if (order.paymentMethod === "UPI" || order.paymentMethod === "Card") {
        online += amount;
      }
      if (order.paymentMethod === "Cash") {
        cash += amount;
      }
    });

    // Get total orders count (all statuses except cancelled)
    const totalOrdersToday = await Order.countDocuments({
      provider: providerId,
      createdAt: { $gte: startOfDay },
      status: { $ne: "cancelled" }
    });

    /* ---------------- TOTAL CUSTOMERS (ALL: Active + Expired) ---------------- */

    const uniqueCustomerIds = await Subscription.distinct("customer", {
      provider: providerId
    });
    const totalCustomers = uniqueCustomerIds.length;

    /* ---------------- ACTIVE SUBSCRIPTIONS ---------------- */

    const activeSubscribers = await Subscription.countDocuments({
      provider: providerId,
      status: { $in: ["active", "approved"] },
      endDate: { $gte: new Date() }
    });

    /* ---------------- PROVIDER RATING ---------------- */

    const provider = await Provider.findOne({ user: providerId }).select(
      "rating totalReviews kitchenStatus messName"
    );

    /* ---------------- URGENT ACTIONS ---------------- */

    // INVENTORY (future)
    const lowStockItems = []; // placeholder

    const expiringSubscriptions = await Subscription.find({
      provider: providerId,
      status: "approved",
      endDate: {
        $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    }).select("planName endDate");

    /* ---------------- RESPONSE ---------------- */

    res.status(200).json({
      success: true,
      data: {
        greeting: `Welcome, ${provider?.messName || "Kitchen"}`,

        kitchenStatus: provider?.kitchenStatus,

        liveOperations: {
          ordersToPrep,
          readyForPickup,
          outForDelivery,
          totalOrdersToday
        },

        businessHealth: {
          todayRevenue: totalRevenue,
          online,
          cash,
          activeSubscribers,
          totalCustomers
        },

        rating: {
          average: provider?.rating || 0,
          totalReviews: provider?.totalReviews || 0
        },

        urgentActions: {
          lowStockItems,
          expiringSubscriptions
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Dashboard fetch failed"
    });
  }
};
