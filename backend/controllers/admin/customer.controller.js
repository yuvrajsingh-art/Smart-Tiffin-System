/**
 * =============================================================================
 * CUSTOMER CONTROLLER
 * =============================================================================
 * Handles customer CRUD operations
 * =============================================================================
 */

const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidEmail, isValidMobile, isValidPassword, isValidObjectId, sanitizeString, validateRequired } = require("../../utils/validationHelper");
const { getStartOfDay } = require("../../utils/dateHelper");
const { getPaginationParams, getPaginationMeta } = require("../../utils/paginationHelper");
const { createLog } = require("./helpers");

/**
 * Get all customers with filters
 * @route GET /api/admin/customers
 * @query {String} status - Filter by status
 * @query {String} search - Search by name, email, mobile
 * @query {Number} page - Page number
 * @query {Number} limit - Items per page
 */
exports.getCustomers = async (req, res) => {
    try {
        const { status, search, page, limit } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);

        // Build query
        let query = { role: 'customer' };
        if (status && status !== 'All') {
            query.status = status.toLowerCase();
        }
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch data
        const [customers, totalCustomers, activeCustomers, balanceData, newToday] = await Promise.all([
            User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'customer', status: 'active' }),
            User.aggregate([
                { $match: { role: 'customer' } },
                { $group: { _id: null, total: { $sum: { $ifNull: ["$walletBalance", 0] } } } }
            ]),
            User.countDocuments({
                role: 'customer',
                createdAt: { $gte: getStartOfDay() }
            })
        ]);

        const totalBalance = balanceData.length > 0 ? balanceData[0].total : 0;
        const paginationMeta = getPaginationMeta(totalCustomers, pageNum, limitNum);

        return sendSuccess(res, 200, "Customers retrieved successfully", {
            data: customers,
            pagination: paginationMeta,
            stats: {
                totalCustomers,
                activeCustomers,
                totalBalance,
                newToday
            }
        });
    } catch (error) {
        console.error("Get Customers Error:", error.message);
        return sendError(res, 500, "Failed to fetch customers", error);
    }
};

/**
 * Add new customer
 * @route POST /api/admin/customers
 * @body {String} fullName - Customer full name
 * @body {String} email - Customer email
 * @body {String} mobile - Customer mobile number
 * @body {String} password - Customer password
 * @body {String} address - Customer address
 */
exports.addCustomer = async (req, res) => {
    try {
        const { fullName, email, mobile, password, address } = req.body;

        // Validate required fields
        const requiredCheck = validateRequired(req.body, ['fullName', 'email', 'mobile', 'password']);
        if (!requiredCheck.valid) {
            return sendError(res, 400, `Missing required fields: ${requiredCheck.missing.join(', ')}`);
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return sendError(res, 400, "Invalid email format");
        }

        // Validate mobile format
        if (!isValidMobile(mobile)) {
            return sendError(res, 400, "Invalid mobile number format");
        }

        // Validate password strength
        const passwordCheck = isValidPassword(password);
        if (!passwordCheck.valid) {
            return sendError(res, 400, passwordCheck.message);
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return sendError(res, 400, "User with this email already exists");
        }

        // Create customer
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await User.create({
            fullName: sanitizeString(fullName),
            email: email.toLowerCase().trim(),
            mobile,
            password: hashedPassword,
            role: 'customer',
            address: address ? sanitizeString(address) : undefined,
            isVerified: true,
            status: 'active'
        });

        // Log action
        await createLog(
            'CUSTOMER_CREATED',
            `New customer ${fullName} added by admin.`,
            req.user.id,
            'person_add',
            'text-blue-500'
        );

        return sendSuccess(res, 201, "Customer added successfully", customer);
    } catch (error) {
        console.error("Add Customer Error:", error.message);
        return sendError(res, 500, "Failed to add customer", error);
    }
};

/**
 * Update customer details
 * @route PUT /api/admin/customers/:id
 * @param {String} id - Customer ID
 * @body {String} fullName - Customer full name
 * @body {String} email - Customer email
 * @body {String} mobile - Customer mobile
 * @body {String} address - Customer address
 * @body {String} status - Customer status
 */
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, mobile, address, status } = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid customer ID");
        }

        // Validate email if provided
        if (email && !isValidEmail(email)) {
            return sendError(res, 400, "Invalid email format");
        }

        // Validate mobile if provided
        if (mobile && !isValidMobile(mobile)) {
            return sendError(res, 400, "Invalid mobile number format");
        }

        const updateData = {};
        if (fullName) updateData.fullName = sanitizeString(fullName);
        if (email) updateData.email = email.toLowerCase().trim();
        if (mobile) updateData.mobile = mobile;
        if (address) updateData.address = sanitizeString(address);
        if (status) updateData.status = status;

        const customer = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!customer) {
            return sendError(res, 404, "Customer not found");
        }

        return sendSuccess(res, 200, "Customer updated successfully", customer);
    } catch (error) {
        console.error("Update Customer Error:", error.message);
        return sendError(res, 500, "Failed to update customer", error);
    }
};

/**
 * Delete customer
 * @route DELETE /api/admin/customers/:id
 * @param {String} id - Customer ID
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid customer ID");
        }

        const customer = await User.findByIdAndDelete(id);
        if (!customer) {
            return sendError(res, 404, "Customer not found");
        }

        // Log action
        await createLog(
            'CUSTOMER_DELETED',
            `Customer ${customer.fullName} was permanently deleted.`,
            req.user.id,
            'person_remove',
            'text-rose-500'
        );

        return sendSuccess(res, 200, "Customer deleted successfully");
    } catch (error) {
        console.error("Delete Customer Error:", error.message);
        return sendError(res, 500, "Failed to delete customer", error);
    }
};

/**
 * Toggle customer status (ban/unban)
 * @route PUT /api/admin/customers/:id/status
 * @param {String} id - Customer ID
 */
exports.toggleCustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid customer ID");
        }

        const customer = await User.findById(id);
        if (!customer) {
            return sendError(res, 404, "Customer not found");
        }

        // Toggle status
        customer.status = customer.status === 'banned' ? 'active' : 'banned';
        await customer.save();

        // Log action
        await createLog(
            'CUSTOMER_STATUS_TOGGLE',
            `Customer ${customer.fullName} was ${customer.status === 'banned' ? 'banned' : 'unbanned'}.`,
            req.user.id,
            customer.status === 'banned' ? 'person_off' : 'person',
            customer.status === 'banned' ? 'text-rose-500' : 'text-emerald-500'
        );

        return sendSuccess(res, 200, `Customer ${customer.status === 'banned' ? 'banned' : 'unbanned'} successfully`, customer);
    } catch (error) {
        console.error("Toggle Customer Status Error:", error.message);
        return sendError(res, 500, "Failed to toggle customer status", error);
    }
};
