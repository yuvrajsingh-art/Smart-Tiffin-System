const Subscription = require("../../models/subscription.model");

// Get all subscribers for a provider
exports.getSubscribers = async (req, res) => {
  try {
    const providerId = req.user._id;
    console.log('getSubscribers - Provider ID:', providerId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const subscriptions = await Subscription.find({
      provider: providerId,
      status: "approved",
      adminApproval: "approved"
    })
      .populate("customer", "name fullName phone mobile email address")
      .sort({ createdAt: -1 });

    console.log('Found subscriptions:', subscriptions.length);
    console.log('Subscriptions:', subscriptions);

    const data = subscriptions.map(sub => {
      let status = "Active";

      // Check if expired
      if (sub.endDate < today) {
        status = "Expired";
      }
      // Check if paused
      else if (
        sub.pauseFrom &&
        sub.pauseTo &&
        today >= sub.pauseFrom &&
        today <= sub.pauseTo
      ) {
        status = "Paused";
      }

      // Calculate meals skipped
      let mealsSkipped = 0;
      if (sub.pauseFrom && sub.pauseTo) {
        const diffTime = Math.abs(sub.pauseTo - sub.pauseFrom);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        mealsSkipped = diffDays + 1;
      }

      return {
        _id: sub._id,
        customer: sub.customer,
        planName: sub.planName,
        planType: `${sub.planName} (${sub.mealType})`,
        mealType: sub.mealType,
        price: sub.price,
        duration: {
          start: sub.startDate,
          end: sub.endDate,
          durationInDays: sub.durationInDays
        },
        mealsSkipped,
        status,
        pauseFrom: sub.pauseFrom,
        pauseTo: sub.pauseTo,
        paymentStatus: sub.paymentStatus,
        createdAt: sub.createdAt
      };
    });

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error('Error in getSubscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
      error: error.message
    });
  }
};


// Get subscription statistics
exports.getSubscriptionStats = async (req, res) => {
  try {
    const providerId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total active subscriptions
    const totalActive = await Subscription.countDocuments({
      provider: providerId,
      status: "approved",
      adminApproval: "approved",
      endDate: { $gte: today },
      $or: [
        { pauseFrom: null },
        { pauseTo: null },
        { pauseTo: { $lt: today } }
      ]
    });

    // Paused subscriptions
    const paused = await Subscription.countDocuments({
      provider: providerId,
      status: "approved",
      adminApproval: "approved",
      pauseFrom: { $lte: today },
      pauseTo: { $gte: today }
    });

    // Expiring this week
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringThisWeek = await Subscription.countDocuments({
      provider: providerId,
      status: "approved",
      adminApproval: "approved",
      endDate: {
        $gte: today,
        $lte: nextWeek
      }
    });

    // Total revenue
    const revenueResult = await Subscription.aggregate([
      {
        $match: {
          provider: providerId,
          status: "approved",
          adminApproval: "approved",
          paymentStatus: "Paid"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalActive,
        paused,
        expiringThisWeek,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Error in getSubscriptionStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription stats',
      error: error.message
    });
  }
};


// Pause a subscription
exports.pauseSubscription = async (req, res) => {
  try {
    const { pauseFrom, pauseTo, reason } = req.body;
    const subscriptionId = req.params.id;
    const providerId = req.user._id;

    // Validate dates
    if (!pauseFrom || !pauseTo) {
      return res.status(400).json({
        success: false,
        message: "Pause from and to dates are required"
      });
    }

    const pauseFromDate = new Date(pauseFrom);
    const pauseToDate = new Date(pauseTo);

    if (pauseFromDate >= pauseToDate) {
      return res.status(400).json({
        success: false,
        message: "Pause from date must be before pause to date"
      });
    }

    // Find and update subscription
    const subscription = await Subscription.findOneAndUpdate(
      {
        _id: subscriptionId,
        provider: providerId,
        status: "approved"
      },
      {
        pauseFrom: pauseFromDate,
        pauseTo: pauseToDate,
        pauseReason: reason || "Paused by provider"
      },
      { new: true }
    ).populate("customer", "name phone email");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription paused successfully",
      data: subscription
    });

  } catch (error) {
    console.error('Error in pauseSubscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause subscription',
      error: error.message
    });
  }
};


// Resume a subscription
exports.resumeSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const providerId = req.user._id;

    // Find and update subscription
    const subscription = await Subscription.findOneAndUpdate(
      {
        _id: subscriptionId,
        provider: providerId,
        status: "approved"
      },
      {
        $unset: {
          pauseFrom: 1,
          pauseTo: 1,
          pauseReason: 1
        }
      },
      { new: true }
    ).populate("customer", "name phone email");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription resumed successfully",
      data: subscription
    });

  } catch (error) {
    console.error('Error in resumeSubscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume subscription',
      error: error.message
    });
  }
};

// Get single subscription details
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const providerId = req.user._id;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      provider: providerId
    }).populate("customer", "name phone email address");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error in getSubscriptionById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription details',
      error: error.message
    });
  }
};

// Update subscription status
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const subscriptionId = req.params.id;
    const providerId = req.user._id;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, approved, or rejected"
      });
    }

    const subscription = await Subscription.findOneAndUpdate(
      {
        _id: subscriptionId,
        provider: providerId
      },
      { status },
      { new: true }
    ).populate("customer", "name phone email");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found or unauthorized"
      });
    }

    res.json({
      success: true,
      message: `Subscription ${status} successfully`,
      data: subscription
    });

  } catch (error) {
    console.error('Error in updateSubscriptionStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription status',
      error: error.message
    });
  }
};
