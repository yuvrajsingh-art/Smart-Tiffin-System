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

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get all delivered orders for today
    const deliveredOrders = await Order.find({
      provider: providerId,
      status: "delivered",
      createdAt: { $gte: startOfDay }
    }).select("amount paymentMethod");

    let todayRevenue = 0;
    let online = 0;
    let cash = 0;

    deliveredOrders.forEach(order => {
      const amount = order.amount || 0;
      todayRevenue += amount;
      if (order.paymentMethod === "UPI" || order.paymentMethod === "Card") {
        online += amount;
      }
      if (order.paymentMethod === "Cash") {
        cash += amount;
      }
    });

    // Get total revenue (all time)
    const allOrders = await Order.find({
      provider: providerId,
      status: "delivered"
    }).select("amount");
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // Get this month revenue
    const thisMonthOrders = await Order.find({
      provider: providerId,
      status: "delivered",
      createdAt: { $gte: startOfMonth }
    }).select("amount");
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // Get last month revenue
    const lastMonthOrders = await Order.find({
      provider: providerId,
      status: "delivered",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }).select("amount");
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // Get total orders count (all statuses except cancelled)
    const totalOrdersToday = await Order.countDocuments({
      provider: providerId,
      createdAt: { $gte: startOfDay },
      status: { $ne: "cancelled" }
    });

    const totalOrdersAllTime = await Order.countDocuments({
      provider: providerId,
      status: { $ne: "cancelled" }
    });

    const totalOrdersThisWeek = await Order.countDocuments({
      provider: providerId,
      createdAt: { $gte: startOfWeek },
      status: { $ne: "cancelled" }
    });

    const totalOrdersThisMonth = await Order.countDocuments({
      provider: providerId,
      createdAt: { $gte: startOfMonth },
      status: { $ne: "cancelled" }
    });

    /* ---------------- TOTAL CUSTOMERS (ALL: Active + Expired) ---------------- */

    const uniqueCustomerIds = await Subscription.distinct("customer", {
      provider: providerId
    });
    const totalCustomers = uniqueCustomerIds.length;

    /* ---------------- ACTIVE SUBSCRIPTIONS ---------------- */

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeSubscribers = await Subscription.countDocuments({
      provider: providerId,
      status: { $in: ["active", "approved"] },
      endDate: { $gte: today },
      $or: [
        { pauseFrom: null },
        { pauseTo: null },
        { pauseTo: { $lt: today } },
        { pauseFrom: { $gt: today } }
      ]
    });

    /* ---------------- PAUSED SUBSCRIPTIONS ---------------- */

    const pausedSubscribers = await Subscription.countDocuments({
      provider: providerId,
      status: { $in: ["active", "approved"] },
      endDate: { $gte: today },
      pauseFrom: { $lte: today },
      pauseTo: { $gte: today }
    });

    console.log('📊 Dashboard Stats:');
    console.log('Active Subscribers:', activeSubscribers);
    console.log('Paused Subscribers:', pausedSubscribers);
    console.log('Total Customers:', totalCustomers);
    console.log('Total Revenue:', totalRevenue);
    console.log('This Month Revenue:', thisMonthRevenue);
    console.log('Last Month Revenue:', lastMonthRevenue);
    console.log('Total Orders All Time:', totalOrdersAllTime);
    console.log('Total Orders This Week:', totalOrdersThisWeek);
    console.log('Total Orders This Month:', totalOrdersThisMonth);

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
          totalOrdersToday,
          totalOrdersAllTime,
          totalOrdersThisWeek,
          totalOrdersThisMonth
        },

        businessHealth: {
          todayRevenue,
          totalRevenue,
          thisMonthRevenue,
          lastMonthRevenue,
          online,
          cash,
          activeSubscribers,
          pausedSubscribers,
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
