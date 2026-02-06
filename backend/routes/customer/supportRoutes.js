const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware.middleware');
const {
    createTicket,
    getMyTickets,
    getTicketById,
    addMessage
} = require('../../controllers/customer/supportController');

// All routes protected by customer authentication
router.use(protect);

router.post('/', createTicket);
router.get('/', getMyTickets);
router.get('/:id', getTicketById);
router.post('/:id/message', addMessage);

module.exports = router;
