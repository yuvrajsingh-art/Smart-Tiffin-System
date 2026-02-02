const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    customerName: {
        type: String,
        required: true
    },
    
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    
    comment: {
        type: String,
        required: true
    },
    
    // Auto-categorized based on rating and keywords
    category: {
        type: String,
        enum: ["positive", "neutral", "negative"],
        required: true
    },
    
    // Priority level
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent", "critical"],
        default: "medium"
    },
    
    // Issue tags
    tags: [{
        type: String,
        enum: ["delay", "quality", "taste", "portion", "delivery", "refund", "feedback", "retention"]
    }],
    
    // Review status
    status: {
        type: String,
        enum: ["pending", "acknowledged", "escalated", "archived", "featured"],
        default: "pending"
    },
    
    // Actions taken
    actions: [{
        action: {
            type: String,
            enum: ["escalate", "tag_issue", "standard_response", "archive", "feature", "thank_you", "quick_acknowledge"]
        },
        takenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        takenAt: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    
    // Response details
    response: {
        message: String,
        sentAt: Date,
        template: String
    },
    
    // Escalation details
    escalation: {
        escalatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        escalatedAt: Date,
        reason: String,
        resolved: {
            type: Boolean,
            default: false
        }
    },
    
    // External platform info
    platform: {
        type: String,
        enum: ["app", "google", "zomato", "swiggy"],
        default: "app"
    },
    
    // Order reference
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    
    // Subscription reference
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscription"
    },
    
    // Featured on socials
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // Thank you sent
    sentThankYou: {
        type: Boolean,
        default: false
    },
    
    // Triage time tracking
    triageStartTime: Date,
    triageEndTime: Date,
    triageTime: Number // in minutes
    
}, { timestamps: true });

// Auto-categorize based on rating
reviewSchema.pre('save', function(next) {
    if (this.rating <= 2) {
        this.category = 'negative';
        this.priority = this.rating === 1 ? 'critical' : 'urgent';
    } else if (this.rating === 3) {
        this.category = 'neutral';
        this.priority = 'medium';
    } else {
        this.category = 'positive';
        this.priority = 'low';
    }
    next();
});

module.exports = mongoose.model("Review", reviewSchema);