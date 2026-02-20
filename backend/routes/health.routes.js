const express = require('express');
const router = express.Router();

// Health check endpoint for Render
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;
