const Ticket = require("../../models/ticket.model");
const { sendSuccess, sendError } = require("../../utils/responseHelper");

// Get tickets for logged-in provider
exports.getProviderTickets = async (req, res) => {
    try {
        const providerId = req.user._id;

        // Find tickets related to this provider
        const tickets = await Ticket.find({ relatedProvider: providerId })
            .populate('user', 'fullName profile_image email mobile')
            .populate('relatedOrder', 'orderNumber menuItems totalAmount status')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Tickets fetched successfully", tickets);
    } catch (error) {
        console.error("Get Provider Tickets Error:", error);
        return sendError(res, 500, "Failed to fetch tickets", error);
    }
};

// Reply to a ticket
exports.replyToTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const providerId = req.user._id;

        if (!text) {
            return sendError(res, 400, "Message text is required");
        }

        const ticket = await Ticket.findOne({ _id: id, relatedProvider: providerId });

        if (!ticket) {
            return sendError(res, 404, "Ticket not found or unauthorized");
        }

        // We use 'admin' sender type as a proxy for 'support staff/provider' for now,
        // unless we migrate the schema to include 'provider'.
        // Let's check if 'provider' is valid in schema enum.
        // Schema: enum: ['user', 'admin', 'system']
        // We will stick to 'admin' (meaning "Resolution Authority") or maybe 'system' to differentiate.
        // Let's proceed with 'admin' but prefix the text: "[Provider]: ..." to be safe, 
        // or just rely on 'admin' for backend simplicity if frontend handles it.

        ticket.messages.push({
            sender: 'admin',
            text: text,
            time: new Date()
        });

        // Update status to 'In Review' if it was New/Open
        if (ticket.status === 'New') {
            ticket.status = 'In Review';
        }

        await ticket.save();

        return sendSuccess(res, 200, "Reply sent successfully", ticket);
    } catch (error) {
        console.error("Reply Ticket Error:", error);
        return sendError(res, 500, "Failed to reply", error);
    }
};

// Mark as Resolved
exports.resolveTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user._id;

        const ticket = await Ticket.findOneAndUpdate(
            { _id: id, relatedProvider: providerId },
            { status: 'Resolved' },
            { new: true }
        );

        if (!ticket) {
            return sendError(res, 404, "Ticket not found");
        }

        return sendSuccess(res, 200, "Ticket resolved", ticket);
    } catch (error) {
        return sendError(res, 500, "Failed to resolve ticket", error);
    }
};
