const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscription",
        required: true
    },

    orderNumber: {
        type: String,
        unique: true,
        required: true
    },

    orderType: {
        type: String,
        enum: ["subscription", "guest"],
        default: "subscription"
    },

    quantity: {
        type: Number,
        default: 1
    },

    orderDate: {
        type: Date,
        required: true
    },

    mealType: {
        type: String,
        enum: ["Lunch", "Dinner"],
        required: true
    },

    status: {
        type: String,
        enum: ["confirmed", "cooking", "prepared", "out_for_delivery", "delivered", "cancelled"],
        default: "confirmed"
    },

    // Tracking timestamps
    confirmedAt: {
        type: Date,
        default: Date.now
    },

    cookingStartedAt: Date,
    preparedAt: Date,
    outForDeliveryAt: Date,
    deliveredAt: Date,

    // Estimated delivery time
    estimatedDeliveryTime: Date,

    // Menu details
    menuItems: [{
        name: String,
        description: String,
        image: String
    }],

    // Delivery details
    deliveryAddress: {
        street: String,
        city: String,
        pincode: String,
        landmark: String
    },

    deliveryInstructions: String,

    // Payment details
    amount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Paid"
    },

    paymentMethod: {
        type: String,
        enum: ["Wallet", "UPI", "Cash", "Card"],
        default: "Wallet"
    },

    // Rating and feedback
    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    feedback: String,

    customization: {
        spiceLevel: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        note: String,
        extras: {
            extraRoti: {
                type: Number,
                default: 0
            },
            extraRice: {
                type: Boolean,
                default: false
            }
        }
    },

    // Cancellation details
    cancellationReason: String,
    cancelledAt: Date,
    refundAmount: Number

}, { timestamps: true });

// Generate order number before validation
orderSchema.pre('validate', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ST-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);