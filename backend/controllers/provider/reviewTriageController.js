const Review = require("../../models/review.model");

// Get dashboard overview with KPIs
exports.getDashboardOverview = async (req, res) => {
    try {
        const providerId = req.user._id;
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        
        // Critical reviews count
        const criticalReviewsCount = await Review.countDocuments({
            provider: providerId,
            priority: { $in: ['critical', 'urgent'] },
            status: 'pending'
        });
        
        // Average satisfaction (current month)
        const currentMonthReviews = await Review.aggregate([
            {
                $match: {
                    provider: providerId,
                    createdAt: { $gte: lastMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Previous month for comparison
        const prevMonth = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
        const prevMonthReviews = await Review.aggregate([
            {
                $match: {
                    provider: providerId,
                    createdAt: { $gte: prevMonth, $lt: lastMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);
        
        const currentAvg = currentMonthReviews[0]?.avgRating || 0;
        const prevAvg = prevMonthReviews[0]?.avgRating || 0;
        const ratingDelta = currentAvg - prevAvg;
        
        // Average triage time
        const triageTimeResult = await Review.aggregate([
            {
                $match: {
                    provider: providerId,
                    triageTime: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    avgTriageTime: { $avg: "$triageTime" }
                }
            }
        ]);
        
        const avgTriageTime = triageTimeResult[0]?.avgTriageTime || 0;
        
        // Escalation rate
        const totalReviews = await Review.countDocuments({ provider: providerId });
        const escalatedReviews = await Review.countDocuments({ 
            provider: providerId, 
            status: 'escalated' 
        });
        const escalationRate = totalReviews > 0 ? (escalatedReviews / totalReviews) * 100 : 0;
        
        // Queue size (pending reviews)
        const queueSize = await Review.countDocuments({
            provider: providerId,
            status: 'pending'
        });
        
        // Operational status
        let operationalStatus = 'optimal';
        if (queueSize > 50 || escalationRate > 5) {
            operationalStatus = 'overloaded';
        } else if (queueSize > 20 || escalationRate > 3) {
            operationalStatus = 'busy';
        }
        
        res.json({
            success: true,
            data: {
                criticalReviewsCount,
                avgRating: parseFloat(currentAvg.toFixed(1)),
                ratingDelta: parseFloat(ratingDelta.toFixed(1)),
                avgTriageTime: Math.round(avgTriageTime),
                escalationRate: parseFloat(escalationRate.toFixed(1)),
                queueSize,
                operationalStatus
            }
        });
        
    } catch (error) {
        console.error('Error in getDashboardOverview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard overview',
            error: error.message
        });
    }
};

// Get categorized reviews (negative, neutral, positive)
exports.getCategorizedReviews = async (req, res) => {
    try {
        const providerId = req.user._id;
        
        // Get negative reviews
        const negativeReviews = await Review.find({
            provider: providerId,
            category: 'negative',
            status: { $in: ['pending', 'acknowledged'] }
        })
        .populate('customer', 'name phone')
        .sort({ priority: -1, createdAt: -1 })
        .limit(10);
        
        // Get neutral reviews
        const neutralReviews = await Review.find({
            provider: providerId,
            category: 'neutral',
            status: { $in: ['pending', 'acknowledged'] }
        })
        .populate('customer', 'name phone')
        .sort({ createdAt: -1 })
        .limit(10);
        
        // Get positive reviews
        const positiveReviews = await Review.find({
            provider: providerId,
            category: 'positive',
            status: { $in: ['pending', 'acknowledged'] }
        })
        .populate('customer', 'name phone')
        .sort({ createdAt: -1 })
        .limit(10);
        
        // Count totals
        const negativeCount = await Review.countDocuments({
            provider: providerId,
            category: 'negative',
            status: { $in: ['pending', 'acknowledged'] }
        });
        
        const neutralCount = await Review.countDocuments({
            provider: providerId,
            category: 'neutral',
            status: { $in: ['pending', 'acknowledged'] }
        });
        
        const positiveCount = await Review.countDocuments({
            provider: providerId,
            category: 'positive',
            status: { $in: ['pending', 'acknowledged'] }
        });
        
        res.json({
            success: true,
            data: {
                negative: {
                    count: negativeCount,
                    reviews: negativeReviews
                },
                neutral: {
                    count: neutralCount,
                    reviews: neutralReviews
                },
                positive: {
                    count: positiveCount,
                    reviews: positiveReviews
                }
            }
        });
        
    } catch (error) {
        console.error('Error in getCategorizedReviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categorized reviews',
            error: error.message
        });
    }
};

// Take action on review
exports.takeReviewAction = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { action, note, responseMessage, tags, escalateTo } = req.body;
        const providerId = req.user._id;
        
        const review = await Review.findOne({
            _id: reviewId,
            provider: providerId
        });
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        // Start triage timing if not started
        if (!review.triageStartTime) {
            review.triageStartTime = new Date();
        }
        
        // Add action to history
        review.actions.push({
            action,
            takenBy: providerId,
            note
        });
        
        // Handle different actions
        switch (action) {
            case 'escalate':
                review.status = 'escalated';
                review.escalation = {
                    escalatedTo: escalateTo,
                    escalatedAt: new Date(),
                    reason: note
                };
                break;
                
            case 'tag_issue':
                if (tags && tags.length > 0) {
                    review.tags = [...new Set([...review.tags, ...tags])];
                }
                break;
                
            case 'standard_response':
            case 'quick_acknowledge':
                review.status = 'acknowledged';
                if (responseMessage) {
                    review.response = {
                        message: responseMessage,
                        sentAt: new Date(),
                        template: action === 'standard_response' ? 'standard' : 'quick'
                    };
                }
                break;
                
            case 'archive':
                review.status = 'archived';
                break;
                
            case 'feature':
                review.isFeatured = true;
                review.status = 'featured';
                break;
                
            case 'thank_you':
                review.sentThankYou = true;
                if (responseMessage) {
                    review.response = {
                        message: responseMessage,
                        sentAt: new Date(),
                        template: 'thank_you'
                    };
                }
                break;
        }
        
        // End triage timing
        if (['escalated', 'acknowledged', 'archived', 'featured'].includes(review.status)) {
            review.triageEndTime = new Date();
            review.triageTime = Math.round((review.triageEndTime - review.triageStartTime) / (1000 * 60));
        }
        
        await review.save();
        
        res.json({
            success: true,
            message: `Action '${action}' completed successfully`,
            data: review
        });
        
    } catch (error) {
        console.error('Error in takeReviewAction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to take review action',
            error: error.message
        });
    }
};

// Bulk actions on multiple reviews
exports.bulkReviewActions = async (req, res) => {
    try {
        const { reviewIds, action, note } = req.body;
        const providerId = req.user._id;
        
        if (!reviewIds || reviewIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No review IDs provided'
            });
        }
        
        const updateData = {
            $push: {
                actions: {
                    action,
                    takenBy: providerId,
                    takenAt: new Date(),
                    note
                }
            }
        };
        
        // Set status based on action
        if (action === 'archive') {
            updateData.status = 'archived';
        } else if (action === 'quick_acknowledge') {
            updateData.status = 'acknowledged';
        }
        
        const result = await Review.updateMany(
            {
                _id: { $in: reviewIds },
                provider: providerId
            },
            updateData
        );
        
        res.json({
            success: true,
            message: `Bulk action completed on ${result.modifiedCount} reviews`,
            modifiedCount: result.modifiedCount
        });
        
    } catch (error) {
        console.error('Error in bulkReviewActions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to perform bulk actions',
            error: error.message
        });
    }
};

// Sync new reviews from external platforms
exports.syncNewReviews = async (req, res) => {
    try {
        const providerId = req.user._id;
        
        // This would integrate with external APIs
        // For now, we'll simulate syncing
        
        const mockReviews = [
            {
                provider: providerId,
                customer: providerId, // Mock customer ID
                customerName: "John Doe",
                rating: 2,
                comment: "Food was cold and delivery was late",
                platform: "google",
                tags: ["delay", "quality"]
            },
            {
                provider: providerId,
                customer: providerId,
                customerName: "Jane Smith", 
                rating: 5,
                comment: "Excellent food and quick delivery!",
                platform: "zomato",
                tags: ["taste", "delivery"]
            }
        ];
        
        // In real implementation, you would:
        // 1. Call Google Places API
        // 2. Call Zomato API
        // 3. Call Swiggy API
        // 4. Parse and save reviews
        
        let syncedCount = 0;
        for (const reviewData of mockReviews) {
            const existingReview = await Review.findOne({
                provider: providerId,
                customerName: reviewData.customerName,
                comment: reviewData.comment
            });
            
            if (!existingReview) {
                await Review.create(reviewData);
                syncedCount++;
            }
        }
        
        res.json({
            success: true,
            message: `Synced ${syncedCount} new reviews`,
            syncedCount
        });
        
    } catch (error) {
        console.error('Error in syncNewReviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync new reviews',
            error: error.message
        });
    }
};