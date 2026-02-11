const StoreProfile = require("../../models/storeProfile.model");

// Get store profile
exports.getStoreProfile = async (req, res) => {
    try {
        const providerId = req.user._id;
        
        let profile = await StoreProfile.findOne({ provider: providerId }).populate('provider', 'fullName email');
        
        // Create default profile if doesn't exist
        if (!profile) {
            profile = new StoreProfile({
                provider: providerId,
                mess_name: "My Tiffin Service",
                contact_number: "",
                cuisines: ["North Indian"],
                lunch_start: "11:00 AM",
                lunch_end: "03:00 PM",
                dinner_start: "07:00 PM",
                dinner_end: "11:00 PM",
                vacation_mode: false,
                delivery_radius_km: 5,
                location: {
                    type: "Point",
                    coordinates: [0, 0]
                }
            });
            await profile.save();
            profile = await StoreProfile.findOne({ provider: providerId }).populate('provider', 'fullName email');
        }
        
        res.json({
            success: true,
            data: profile
        });
        
    } catch (error) {
        console.error('Error in getStoreProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch store profile',
            error: error.message
        });
    }
};

// Update store profile
exports.updateStoreProfile = async (req, res) => {
    try {
        const providerId = req.user._id;
        const {
            mess_name,
            contact_number,
            cuisines,
            description,
            store_image,
            address
        } = req.body;
        
        let profile = await StoreProfile.findOne({ provider: providerId });
        
        if (!profile) {
            profile = new StoreProfile({ provider: providerId });
        }
        
        // Update fields
        if (mess_name) profile.mess_name = mess_name;
        if (contact_number) profile.contact_number = contact_number;
        if (cuisines) profile.cuisines = cuisines;
        if (description) profile.description = description;
        if (store_image) profile.store_image = store_image;
        if (address) profile.address = address;
        
        await profile.save();
        
        res.json({
            success: true,
            message: 'Store profile updated successfully',
            data: profile
        });
        
    } catch (error) {
        console.error('Error in updateStoreProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update store profile',
            error: error.message
        });
    }
};

// Update kitchen timings
exports.updateKitchenTimings = async (req, res) => {
    try {
        const providerId = req.user._id;
        const {
            lunch_start,
            lunch_end,
            dinner_start,
            dinner_end
        } = req.body;
        
        let profile = await StoreProfile.findOne({ provider: providerId });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Store profile not found'
            });
        }
        
        // Update timings
        if (lunch_start) profile.lunch_start = lunch_start;
        if (lunch_end) profile.lunch_end = lunch_end;
        if (dinner_start) profile.dinner_start = dinner_start;
        if (dinner_end) profile.dinner_end = dinner_end;
        
        await profile.save();
        
        res.json({
            success: true,
            message: 'Kitchen timings updated successfully',
            data: {
                lunch_start: profile.lunch_start,
                lunch_end: profile.lunch_end,
                dinner_start: profile.dinner_start,
                dinner_end: profile.dinner_end
            }
        });
        
    } catch (error) {
        console.error('Error in updateKitchenTimings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update kitchen timings',
            error: error.message
        });
    }
};

// Toggle vacation mode
exports.toggleVacationMode = async (req, res) => {
    try {
        const providerId = req.user._id;
        const {
            status,
            reason,
            start_date,
            end_date
        } = req.body;
        
        let profile = await StoreProfile.findOne({ provider: providerId });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Store profile not found'
            });
        }
        
        profile.vacation_mode = status;
        
        if (status) {
            // Enabling vacation mode
            profile.vacation_reason = reason;
            profile.vacation_start_date = start_date ? new Date(start_date) : new Date();
            profile.vacation_end_date = end_date ? new Date(end_date) : null;
        } else {
            // Disabling vacation mode
            profile.vacation_reason = null;
            profile.vacation_start_date = null;
            profile.vacation_end_date = null;
        }
        
        await profile.save();
        
        res.json({
            success: true,
            message: `Vacation mode ${status ? 'enabled' : 'disabled'} successfully`,
            data: {
                vacation_mode: profile.vacation_mode,
                vacation_reason: profile.vacation_reason,
                vacation_start_date: profile.vacation_start_date,
                vacation_end_date: profile.vacation_end_date
            }
        });
        
    } catch (error) {
        console.error('Error in toggleVacationMode:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle vacation mode',
            error: error.message
        });
    }
};

// Update delivery zone
exports.updateDeliveryZone = async (req, res) => {
    try {
        const providerId = req.user._id;
        const { radius, latitude, longitude } = req.body;
        
        if (!radius || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Radius, latitude, and longitude are required'
            });
        }
        
        let profile = await StoreProfile.findOne({ provider: providerId });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Store profile not found'
            });
        }
        
        profile.delivery_radius_km = radius;
        profile.location.coordinates = [longitude, latitude];
        
        await profile.save();
        
        res.json({
            success: true,
            message: 'Delivery zone updated successfully',
            data: {
                delivery_radius_km: profile.delivery_radius_km,
                location: profile.location
            }
        });
        
    } catch (error) {
        console.error('Error in updateDeliveryZone:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update delivery zone',
            error: error.message
        });
    }
};

// Get store status (for customers to check availability)
exports.getStoreStatus = async (req, res) => {
    try {
        const providerId = req.params.providerId;
        
        const profile = await StoreProfile.findOne({ provider: providerId });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }
        
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        // Check if currently in vacation mode
        let isOnVacation = profile.vacation_mode;
        if (profile.vacation_end_date && now > profile.vacation_end_date) {
            // Auto-disable vacation mode if end date passed
            profile.vacation_mode = false;
            profile.vacation_reason = null;
            profile.vacation_start_date = null;
            profile.vacation_end_date = null;
            await profile.save();
            isOnVacation = false;
        }
        
        // Check if currently serving (within kitchen timings)
        const isLunchTime = isTimeInRange(currentTime, profile.lunch_start, profile.lunch_end);
        const isDinnerTime = isTimeInRange(currentTime, profile.dinner_start, profile.dinner_end);
        const isCurrentlyServing = (isLunchTime || isDinnerTime) && !isOnVacation;
        
        res.json({
            success: true,
            data: {
                mess_name: profile.mess_name,
                contact_number: profile.contact_number,
                cuisines: profile.cuisines,
                is_active: profile.is_active,
                vacation_mode: isOnVacation,
                vacation_reason: profile.vacation_reason,
                is_currently_serving: isCurrentlyServing,
                lunch_timings: {
                    start: profile.lunch_start,
                    end: profile.lunch_end
                },
                dinner_timings: {
                    start: profile.dinner_start,
                    end: profile.dinner_end
                },
                delivery_radius_km: profile.delivery_radius_km,
                location: profile.location
            }
        });
        
    } catch (error) {
        console.error('Error in getStoreStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch store status',
            error: error.message
        });
    }
};

// Helper function to check if current time is within range
function isTimeInRange(currentTime, startTime, endTime) {
    const current = convertTo24Hour(currentTime);
    const start = convertTo24Hour(startTime);
    const end = convertTo24Hour(endTime);
    
    return current >= start && current <= end;
}

function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
}