const Tiffin = require("../models/tiffin.model");


// CREATE TIFFIN PLAN (Provider)
exports.createTiffinPlan = async (req, res) => {
  try {
    const { planName, planType, totalDays, mealTypes, price } = req.body;

    const plan = await Tiffin.create({
      provider: req.user.id,
      planName,
      planType,
      totalDays,
      mealTypes,
      price
    });

    res.status(201).json({
      success: true,
      message: "Tiffin plan created successfully",
      plan
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL ACTIVE PLANS (Customer)
exports.getAllTiffinPlans = async (req, res) => {
  try {
    const plans = await Tiffin.find({ isActive: true })
      .populate("provider", "name email phone address");

    res.status(200).json({
      success: true,
      count: plans.length,
      plans
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET PROVIDER'S OWN PLANS
exports.getMyTiffinPlans = async (req, res) => {
  try {
    const plans = await Tiffin.find({ provider: req.user.id });

    res.status(200).json({
      success: true,
      plans
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PLAN
exports.updateTiffinPlan = async (req, res) => {
  try {
    const plan = await Tiffin.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Tiffin plan not found" });
    }

    if (plan.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedPlan = await Tiffin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Tiffin plan updated successfully",
      updatedPlan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// SOFT DELETE (Disable Plan)
exports.disableTiffinPlan = async (req, res) => {
  try {
    const plan = await Tiffin.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Tiffin plan not found" });
    }

    if (plan.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    plan.isActive = false;
    await plan.save();

    res.status(200).json({
      success: true,
      message: "Tiffin plan disabled successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
