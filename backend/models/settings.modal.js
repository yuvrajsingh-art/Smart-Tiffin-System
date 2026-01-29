const mongoose = require("mongoose");


const settingsSchema = new mongoose.Schema({
    daily_cutoff_time: String,
    is_daily_menu_mandatory: Boolean,
    maintenance_mode: Boolean,
    global_freeze: Boolean,
    security_logs: [
        {
            action: String,
            admin_id: mongoose.Schema.Types.ObjectId,
            time: Date,
            details: String
        }
    ]
});


module.exports = mongoose.model("Settings", settingsSchema);
