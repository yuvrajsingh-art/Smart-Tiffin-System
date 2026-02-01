const cron = require('node-cron');
const { Menu } = require("../models/menu.model");
const Settings = require("../models/settings.model");

const initScheduledJobs = () => {
    console.log("Initializing Cron Jobs...");

    // 1. Daily Menu Cleanup (Runs at Midnight 00:00)
    // Goal: Mark past menus as 'Archived' (if we had such a status) or just ensure no stale 'Pending' requests remain.
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log("Running Daily Menu Cleanup...");
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(23, 59, 59, 999);

            // Reject any pending menus from the past
            const result = await Menu.updateMany(
                {
                    menuDate: { $lte: yesterday },
                    approvalStatus: 'Pending'
                },
                {
                    approvalStatus: 'Rejected',
                    adminRemarks: 'System Auto-Rejection (Expired)'
                }
            );

            console.log(`Cleanup Complete: Auto-rejected ${result.modifiedCount} expired menus.`);
        } catch (error) {
            console.error("Daily Cleanup Job Failed:", error);
        }
    });

    // 2. Weekly Invoice Generation Stub (Runs every Monday at 02:00 AM)
    cron.schedule('0 2 * * 1', () => {
        console.log("Running Weekly Invoice Generation Task...");
        // Logic to generate PDF invoices for all providers would go here.
        // For now, just logging the event.
    });
};

module.exports = initScheduledJobs;
