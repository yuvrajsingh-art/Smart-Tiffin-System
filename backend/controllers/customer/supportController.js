const Ticket = require("../../models/ticket.model");
const Order = require("../../models/order.model");
const Subscription = require("../../models/subscription.model");

// Create a support ticket
exports.createTicket = async (req, res) => {
    try {
        const { issue, description, priority, relatedOrderId, relatedProviderId } = req.body;
        const customerId = req.user._id;

        if (!issue) {
            return res.status(400).json({
                success: false,
                message: 'Issue subject is required'
            });
        }

        const ticket = await Ticket.create({
            user: customerId,
            issue,
            description,
            priority: priority || 'Medium',
            relatedOrder: relatedOrderId || undefined,
            relatedProvider: relatedProviderId || undefined,
            messages: [{
                sender: 'user',
                text: description || issue,
                time: new Date()
            }]
        });

        res.status(201).json({
            success: true,
            data: ticket,
            message: 'Support ticket created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create support ticket',
            error: error.message
        });
    }
};

// Get all tickets for the logged-in customer
exports.getMyTickets = async (req, res) => {
    try {
        const customerId = req.user._id;
        const tickets = await Ticket.find({ user: customerId })
            .populate('relatedProvider', 'businessName fullName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tickets',
            error: error.message
        });
    }
};

// Get a specific ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.user._id;

        const ticket = await Ticket.findOne({ _id: id, user: customerId })
            .populate('relatedProvider', 'businessName fullName')
            .populate('relatedOrder');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.json({
            success: true,
            data: ticket
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket details',
            error: error.message
        });
    }
};

// Add a message (reply) to an existing ticket
exports.addMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const customerId = req.user._id;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Message text is required'
            });
        }

        const ticket = await Ticket.findOne({ _id: id, user: customerId });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        ticket.messages.push({
            sender: 'user',
            text,
            time: new Date()
        });

        // Reopen ticket if it was closed? Or just keep current status
        if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
            ticket.status = 'Open';
        }

        await ticket.save();

        res.json({
            success: true,
            data: ticket,
            message: 'Message added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add message',
            error: error.message
        });
    }
};
