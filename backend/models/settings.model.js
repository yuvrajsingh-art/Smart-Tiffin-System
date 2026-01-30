const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    // Menu Logic
    isDailyMandatory: { type: Boolean, default: true },
    dailyCutoffTime: { type: String, default: '10:30' },
    allowSameDayEdit: { type: Boolean, default: false },
    isWeeklyMandatory: { type: Boolean, default: true },
    maxDishesPerTiffin: { type: Number, default: 6 },
    jainMandatory: { type: Boolean, default: true },

    // Financials
    baseCommission: { type: Number, default: 15 },
    premiumCommission: { type: Number, default: 12 },
    gstRate: { type: Number, default: 5 },
    minPayoutThreshold: { type: Number, default: 2000 },

    // System
    appName: { type: String, default: 'Smart Tiffin System' },
    maintenanceMode: { type: Boolean, default: false },
    cacheHealth: { type: Number, default: 98.2 },

    // Notifications
    notifCustomerSMS: { type: Boolean, default: true },
    notifCustomerPush: { type: Boolean, default: true },
    notifProviderEmail: { type: Boolean, default: true },
    notifProviderPush: { type: Boolean, default: true },
    notifAdminUrgent: { type: Boolean, default: true },

    // Security
    globalFreeze: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: true },
    ipLockdown: { type: Boolean, default: false },

    // Customer Policies
    cancellationFee: { type: Number, default: 50 },
    refundSlab6h: { type: Number, default: 100 },
    refundSlab2h: { type: Number, default: 50 },
    autoWalletRefund: { type: Boolean, default: true },

    // Compliance
    fssaiMandatory: { type: Boolean, default: true },
    gstProofRequired: { type: Boolean, default: false },
    aadharVerifiedOnly: { type: Boolean, default: true },

    // Integrations
    smsProvider: { type: String, default: 'Twilio' },
    mapsApiKey: { type: String, default: '' },
    smtpHost: { type: String, default: 'smtp.sendgrid.net' },

    // Localization
    currencyCode: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    defaultLang: { type: String, default: 'Hinglish' },

    // Active Broadcast
    activeBroadcast: {
        message: String,
        createdAt: Date,
        isActive: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
