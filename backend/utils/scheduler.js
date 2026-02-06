const cron = require('node-cron');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');

const initScheduledJobs = () => {
  console.log('📅 Initializing scheduled jobs...');

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
  });
};

module.exports = initScheduledJobs;