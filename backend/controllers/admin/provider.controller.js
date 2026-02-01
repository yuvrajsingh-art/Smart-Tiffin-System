/**
 * =============================================================================
 * PROVIDER CONTROLLER
 * =============================================================================
 * Handles provider management operations
 * =============================================================================
 */

const User = require("../../models/user.model");
const Provider = require("../../models/providerprofile.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidObjectId } = require("../../utils/validationHelper");
const { createLog } = require("./helpers");

/**
 * Get all providers with filters
 * @route GET /api/admin/providers
 * @query {String} status - Filter: 'Active' or 'Pending'
 * @query {String} search - Search by name or email
 */
exports.getProviders = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { role: 'provider' };

        // Status filter
        if (status && status !== 'All') {
            if (status === 'Active') query.isVerified = true;
            else if (status === 'Pending') query.isVerified = false;
        }

        // Search filter
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const providers = await User.find(query).sort({ createdAt: -1 });
        const providerIds = providers.map(p => p._id);
        const profiles = await Provider.find({ owner: { $in: providerIds } });

        // Merge profile data
        const mergedData = providers.map(provider => {
            const profile = profiles.find(p => p.owner.toString() === provider._id.toString());
            return {
                ...provider.toObject(),
                profile: profile || null
            };
        });

        return sendSuccess(res, 200, "Providers retrieved successfully", mergedData);
    } catch (error) {
        console.error("Get Providers Error:", error.message);
        return sendError(res, 500, "Failed to fetch providers", error);
    }
};

/**
 * Verify/Approve provider
 * @route PUT /api/admin/providers/:id/verify
 * @param {String} id - Provider ID
 */
exports.verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findByIdAndUpdate(
            id,
            { isVerified: true },
            { new: true }
        );

        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        // Log action
        await createLog(
            'PROVIDER_VERIFIED',
            `Provider ${provider.fullName} was approved.`,
            req.user.id,
            'verified',
            'text-emerald-500'
        );

        return sendSuccess(res, 200, "Provider verified successfully", provider);
    } catch (error) {
        console.error("Verify Provider Error:", error.message);
        return sendError(res, 500, "Failed to verify provider", error);
    }
};

/**
 * Toggle provider status (suspend/activate)
 * @route PUT /api/admin/providers/:id/status
 * @param {String} id - Provider ID
 */
exports.toggleProviderStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findById(id);
        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        // Toggle status
        provider.status = provider.status === 'active' ? 'suspended' : 'active';
        await provider.save();

        // Log action
        await createLog(
            'PROVIDER_STATUS_TOGGLE',
            `Provider ${provider.fullName} status set to ${provider.status}.`,
            req.user.id,
            provider.status === 'active' ? 'check_circle' : 'block',
            provider.status === 'active' ? 'text-emerald-500' : 'text-rose-500'
        );

        return sendSuccess(res, 200, `Provider ${provider.status === 'active' ? 'activated' : 'suspended'}`, provider);
    } catch (error) {
        console.error("Toggle Provider Error:", error.message);
        return sendError(res, 500, "Failed to toggle provider status", error);
    }
};

/**
 * Update provider details
 * @route PUT /api/admin/providers/:id
 * @param {String} id - Provider ID
 * @body {Object} updateData - Provider update data
 */
exports.updateProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        return sendSuccess(res, 200, "Provider updated successfully", provider);
    } catch (error) {
        console.error("Update Provider Error:", error.message);
        return sendError(res, 500, "Failed to update provider", error);
    }
};

/**
 * Delete provider
 * @route DELETE /api/admin/providers/:id
 * @param {String} id - Provider ID
 */
exports.deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await User.findByIdAndDelete(id);
        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        // Delete provider profile
        await Provider.findOneAndDelete({ owner: id });

        return sendSuccess(res, 200, "Provider deleted successfully");
    } catch (error) {
        console.error("Delete Provider Error:", error.message);
        return sendError(res, 500, "Failed to delete provider", error);
    }
};
