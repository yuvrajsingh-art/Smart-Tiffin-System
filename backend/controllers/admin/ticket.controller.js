/**
 * =============================================================================
 * TICKET CONTROLLER
 * =============================================================================
 * Handles support ticket operations
 * =============================================================================
 */

const User = require("../../models/user.model");
const Ticket = require("../../models/ticket.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidObjectId } = require("../../utils/validationHelper");
const { formatDate, formatTime, getEndOfDay } = require("../../utils/dateHelper");

/**
 * Get all support tickets
 * @route GET /api/admin/tickets
 * @query {String} status - Filter by status
 * @query {String} startDate - Start date for range
 * @query {String} endDate - End date for range
 * @query {String} search - Search by user name, email, issue
 */
exports.getTickets = async (req, res) => {
    try {
        const { status, startDate, endDate, search } = req.query;
        let query = {};

        // Status filter
        if (status && status !== 'All') {
            query.status = status;
        }

        // Date range filter
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: getEndOfDay(new Date(endDate))
            };
        }

        // Search logic
        if (search) {
            const userMatch = await User.find({
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = userMatch.map(u => u._id);
            query.$or = [
                { user: { $in: userIds } },
                { issue: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];

            if (isValidObjectId(search)) {
                query.$or.push({ _id: search });
            }
        }

        const tickets = await Ticket.find(query)
            .populate('user', 'fullName email')
            .populate('relatedProvider', 'businessName')
            .sort({ createdAt: -1 });

        const formattedTickets = tickets.map(t => ({
            id: t._id,
            displayId: `TKT${t._id.toString().slice(-4).toUpperCase()}`,
            user: t.user?.fullName || 'Unknown User',
            email: t.user?.email || 'N/A',
            issue: t.issue,
            priority: t.priority,
            status: t.status,
            date: formatDate(t.createdAt),
            time: formatTime(t.createdAt),
            kitchen: t.relatedProvider?.businessName || 'System',
            hasUnread: false
        }));

        return sendSuccess(res, 200, "Tickets retrieved successfully", formattedTickets);
    } catch (error) {
        console.error("Get Tickets Error:", error.message);
        return sendError(res, 500, "Failed to fetch tickets", error);
    }
};

/**
 * Get single ticket by ID
 * @route GET /api/admin/tickets/:id
 * @param {String} id - Ticket ID
 */
exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid ticket ID");
        }

        const ticket = await Ticket.findById(id)
            .populate('user', 'fullName email mobile')
            .populate('relatedOrder')
            .populate('relatedProvider', 'fullName businessName');

        if (!ticket) {
            return sendError(res, 404, "Ticket not found");
        }

        return sendSuccess(res, 200, "Ticket retrieved successfully", ticket);
    } catch (error) {
        console.error("Get Ticket Error:", error.message);
        return sendError(res, 500, "Failed to fetch ticket", error);
    }
};

/**
 * Resolve ticket
 * @route PUT /api/admin/tickets/:id/resolve
 * @param {String} id - Ticket ID
 * @body {String} resolution - Resolution details
 */
exports.resolveTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid ticket ID");
        }

        const ticket = await Ticket.findByIdAndUpdate(
            id,
            {
                status: 'Resolved',
                description: resolution ? `${resolution}` : undefined
            },
            { new: true }
        ).populate('user', 'fullName email')
            .populate('relatedProvider', 'businessName');

        if (!ticket) {
            return sendError(res, 404, "Ticket not found");
        }

        // Emit real-time event
        if (req.io) {
            req.io.emit('ticket-updated', { ticket });
        }

        return sendSuccess(res, 200, "Ticket resolved successfully", ticket);
    } catch (error) {
        console.error("Resolve Ticket Error:", error.message);
        return sendError(res, 500, "Failed to resolve ticket", error);
    }
};

/**
 * Reply to ticket
 * @route POST /api/admin/tickets/:id/reply
 * @param {String} id - Ticket ID
 * @body {String} message - Reply message
 */
exports.replyToTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid ticket ID");
        }

        if (!message || !message.trim()) {
            return sendError(res, 400, "Message is required");
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return sendError(res, 404, "Ticket not found");
        }

        ticket.messages.push({
            sender: 'admin',
            text: message.trim(),
            time: new Date()
        });

        // Update status if needed
        if (ticket.status === 'New') {
            ticket.status = 'In Review';
        }

        await ticket.save();

        return sendSuccess(res, 200, "Reply sent successfully", ticket);
    } catch (error) {
        console.error("Reply To Ticket Error:", error.message);
        return sendError(res, 500, "Failed to send reply", error);
    }
};
