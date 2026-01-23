const Subscription = require("../models/subscription.model.js")

// CREATE SUBSCRIPTION
exports.createSubscription = async (req, res) => {
    try {
        const {
            provider,
            planName,
            price,
            durationInDays,
            startDate,
            mealType,
            paymentMethod
        } = req.body;

        // endDate calculate
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + durationInDays);

        const subscription = await Subscription.create({
            customer: req.user.id,   // auth middleware se
            provider,
            planName,
            price,
            durationInDays,
            startDate,
            endDate,
            mealType,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            subscription
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMySubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find(
            { customer: req.user.id }
        ).populate('provider', 'name email phone address');

        res.status(200).json({
            success: true,
            subscriptions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.pauseSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({message: "Subscription not found"});
        }

        subscription.status = "Paused";
        subscription.pauseFrom = new Date();

        await subscription.save();

        res.status(200).json({
            success: true,
            message: "subscription paused successfully",
            subscription
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.resumeSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({message: "subscription not found"});
        }
            if (subscription.status !== "Paused") {
                return res.status(400).json({message: "subscription is not paused"});
            }

            subscription.status = "Active";
            subscription.pauseTo = new Date();

            await subscription.save();

            res.status(200).json({
                success: true,
                message: "subscription resumed successfully"
            });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        if (subscription.status === "Cancelled"){
            return res.status(404).json({message: "Subscription already cancelled"});
        }

        subscription.status = "Cancelled";
        await subscription.save();

        res.json({
            success: true,
            message: "Subscription cancelled"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

