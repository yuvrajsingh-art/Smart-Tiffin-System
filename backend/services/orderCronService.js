const cron = require('node-cron');
const Order = require('../models/order.model');
const Subscription = require('../models/subscription.model');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');

// Auto-create orders for active subscriptions
const createDailyOrders = async () => {
    try {
        console.log('🔄 Running daily order creation...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find all active subscriptions
        const activeSubscriptions = await Subscription.find({
            status: { $in: ['approved', 'active'] },
            startDate: { $lte: today },
            endDate: { $gte: today }
        }).populate('customer provider');

        let ordersCreated = 0;

        for (const sub of activeSubscriptions) {
            // Check if paused today
            const isPaused = sub.pauseFrom && sub.pauseTo && 
                            new Date(sub.pauseFrom) <= today && 
                            new Date(sub.pauseTo) >= today;
            
            if (isPaused) continue;

            // Check meal types
            const mealTypes = [];
            if (sub.mealType === 'Lunch' || sub.mealType === 'Both') mealTypes.push('Lunch');
            if (sub.mealType === 'Dinner' || sub.mealType === 'Both') mealTypes.push('Dinner');

            for (const mealType of mealTypes) {
                // Check if order already exists
                const existingOrder = await Order.findOne({
                    customer: sub.customer._id,
                    provider: sub.provider._id,
                    subscription: sub._id,
                    orderDate: { $gte: today, $lt: tomorrow },
                    mealType
                });

                if (existingOrder) continue;

                // Create order
                const deliveryTime = mealType === 'Lunch' ? '11:00' : '19:00';
                await Order.create({
                    customer: sub.customer._id,
                    provider: sub.provider._id,
                    subscription: sub._id,
                    orderDate: today,
                    mealType,
                    deliveryTime,
                    orderType: 'subscription',
                    amount: 0,
                    paymentStatus: 'Paid',
                    status: 'confirmed',
                    deliveryAddress: sub.deliveryAddress,
                    menuItems: [{
                        name: `${mealType} Meal`,
                        description: 'Daily subscription meal'
                    }]
                });
                ordersCreated++;
            }
        }

        console.log(`✅ Created ${ordersCreated} orders for today`);
    } catch (error) {
        console.error('❌ Error creating daily orders:', error);
    }
};

// Auto-update order status based on time
const updateOrderStatusByTime = async () => {
    try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get today's orders
        const orders = await Order.find({
            orderDate: { $gte: today, $lt: tomorrow },
            status: { $nin: ['delivered', 'cancelled'] }
        });

        for (const order of orders) {
            const mealType = order.mealType.toLowerCase();
            let shouldUpdate = false;
            let newStatus = order.status;

            if (mealType === 'lunch') {
                // Lunch timeline: 11 AM delivery
                if (currentHour >= 9 && order.status === 'confirmed') {
                    newStatus = 'cooking';
                    shouldUpdate = true;
                } else if (currentHour >= 10 && order.status === 'cooking') {
                    newStatus = 'prepared';
                    shouldUpdate = true;
                } else if (currentHour >= 10 && currentMinute >= 30 && order.status === 'prepared') {
                    newStatus = 'out_for_delivery';
                    shouldUpdate = true;
                } else if (currentHour >= 11 && order.status === 'out_for_delivery') {
                    newStatus = 'delivered';
                    shouldUpdate = true;
                }
            } else if (mealType === 'dinner') {
                // Dinner timeline: 7 PM delivery
                if (currentHour >= 17 && order.status === 'confirmed') {
                    newStatus = 'cooking';
                    shouldUpdate = true;
                } else if (currentHour >= 18 && order.status === 'cooking') {
                    newStatus = 'prepared';
                    shouldUpdate = true;
                } else if (currentHour >= 18 && currentMinute >= 30 && order.status === 'prepared') {
                    newStatus = 'out_for_delivery';
                    shouldUpdate = true;
                } else if (currentHour >= 19 && order.status === 'out_for_delivery') {
                    newStatus = 'delivered';
                    shouldUpdate = true;
                }
            }

            if (shouldUpdate) {
                order.status = newStatus;
                const tsMap = {
                    'cooking': 'cookingStartedAt',
                    'prepared': 'preparedAt',
                    'out_for_delivery': 'outForDeliveryAt',
                    'delivered': 'deliveredAt'
                };
                if (tsMap[newStatus] && !order[tsMap[newStatus]]) {
                    order[tsMap[newStatus]] = new Date();
                }
                await order.save();
                
                // Add earnings to wallet when delivered
                if (newStatus === 'delivered') {
                    await addOrderEarnings(order);
                }
                
                console.log(`✅ Updated order ${order.orderNumber} to ${newStatus}`);
            }
        }
    } catch (error) {
        console.error('❌ Error updating order status:', error);
    }
};

// Add earnings to provider wallet
const addOrderEarnings = async (order) => {
    try {
        const subscription = await Subscription.findById(order.subscription);
        if (!subscription) return;
        
        const amount = subscription.price || 50; // Default 50 per meal
        
        let wallet = await Wallet.findOne({ provider: order.provider });
        if (!wallet) {
            wallet = new Wallet({
                provider: order.provider,
                totalEarnings: 0,
                withdrawableBalance: 0,
                lockedAmount: 0
            });
        }
        
        const transaction = new Transaction({
            provider: order.provider,
            transactionType: 'Order Payment',
            referenceId: order.orderNumber,
            amount: amount,
            status: 'Success',
            description: `Payment for ${order.mealType} order`,
            orderId: order._id
        });
        
        await transaction.save();
        
        wallet.totalEarnings += amount;
        wallet.withdrawableBalance += amount;
        await wallet.save();
        
        console.log(`💰 Added ₹${amount} to provider wallet for order ${order.orderNumber}`);
    } catch (error) {
        console.error('❌ Error adding earnings:', error);
    }
};

// Initialize cron jobs
const initializeCronJobs = () => {
    // Create daily orders at 12:01 AM
    cron.schedule('1 0 * * *', createDailyOrders);
    
    // Update order status every 15 minutes
    cron.schedule('*/15 * * * *', updateOrderStatusByTime);
    
    console.log('✅ Order cron jobs initialized');
    
    // Run immediately on startup
    createDailyOrders();
    updateOrderStatusByTime();
};

module.exports = { initializeCronJobs, createDailyOrders, updateOrderStatusByTime, addOrderEarnings };
