const cron = require('node-cron');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');

// Defined outside to be exported
const generateDailyOrders = async () => {
  console.log('🍳 Running daily order generation...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find active subscriptions
    const activeSubs = await Subscription.find({
      status: { $in: ['approved', 'active'] },
      endDate: { $gte: today },
      startDate: { $lte: today }
    });

    console.log(`📋 Found ${activeSubs.length} active subscriptions.`);

    let createdCount = 0;

    for (const sub of activeSubs) {
      // Skip if paused
      const isPaused = sub.pausedDates && sub.pausedDates.some(d => {
        const pd = new Date(d);
        pd.setHours(0, 0, 0, 0);
        return pd.getTime() === today.getTime();
      });

      if (isPaused) {
        console.log(`⏸️ Subscription ${sub._id} is paused for today.`);
        continue;
      }

      // Determine meal type for today
      const Order = require('../models/order.model');

      // Helper to create order
      const createOrder = async (mealType) => {
        // Check if order already exists
        const exists = await Order.findOne({
          subscription: sub._id,
          orderDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
          mealType: mealType
        });

        if (exists) return;

        await Order.create({
          customer: sub.customer,
          provider: sub.provider,
          subscription: sub._id,
          orderType: 'subscription',
          mealType: mealType,
          orderDate: today,
          status: 'confirmed', // Auto-confirm
          paymentStatus: 'Paid', // Subscription is prepaid
          amount: (sub.price || sub.totalAmount) / (sub.durationInDays || 30), // Pro-rated amount for tracking
          deliveryAddress: sub.deliveryAddress,
          menuItems: [] // To be populated by provider menu later or connected via UI
        });
        createdCount++;
      };

      if (sub.mealType === 'Lunch' || sub.mealType === 'Both') await createOrder('Lunch');
      if (sub.mealType === 'Dinner' || sub.mealType === 'Both') await createOrder('Dinner');
    }

    console.log(`✅ Generated ${createdCount} orders for today.`);
    return createdCount;

  } catch (error) {
    console.error('❌ Error generating orders:', error);
  }
};

const initScheduledJobs = () => {
  console.log('📅 Initializing scheduled jobs...');

  // Daily job at 01:00 AM to generate daily orders for active subscriptions
  cron.schedule('0 1 * * *', generateDailyOrders);

  // Daily job at midnight to handle expired subscriptions and cleanups
  cron.schedule('0 0 * * *', async () => {
    console.log('🧹 Running daily maintenance job...');

    try {
      const now = new Date();

      // 1. Find all subscriptions that should have expired by now
      const expiredSubscriptions = await Subscription.find({
        status: { $in: ['approved', 'active'] },
        endDate: { $lte: now }
      });

      if (expiredSubscriptions.length > 0) {
        console.log(`🕒 Found ${expiredSubscriptions.length} subscriptions to expire.`);

        for (const sub of expiredSubscriptions) {
          // Update subscription status
          sub.status = 'expired';
          await sub.save();

          // Clear user's active subscription status
          await User.findByIdAndUpdate(sub.customer, {
            hasActiveSubscription: false,
            activeSubscription: null
          });
        }
        console.log('✅ Successfully processed expired subscriptions.');
      }

    } catch (error) {
      console.error('❌ Error in daily maintenance job:', error);
    }
  });

  // Example: Weekly report generation on Sundays at 9 AM
  cron.schedule('0 9 * * 0', () => {
    console.log('📊 Generating weekly reports...');
    // Add report generation logic here
  })
    
  };


  module.exports = { initScheduledJobs, runDailyOrders: generateDailyOrders };
