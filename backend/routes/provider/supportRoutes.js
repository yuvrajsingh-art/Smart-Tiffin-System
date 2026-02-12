const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../../middleware/authMiddleware.middleware');
const {
    getProviderTickets,
    replyToTicket,
    resolveTicket
} = require('../../controllers/provider/providerSupportController');

// All routes are protected and restricted to providers
router.use(protect);
router.use(authorizeRoles('provider'));

router.get('/', getProviderTickets);
router.post('/:id/reply', replyToTicket);
router.put('/:id/resolve', resolveTicket);

module.exports = router;
