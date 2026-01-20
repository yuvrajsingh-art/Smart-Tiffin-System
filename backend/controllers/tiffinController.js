const Tiffin = require("../models/tiffin.model");

// ============ ADD TIFFIN (Provider) ============
exports.addTiffin = async (req, res) => {
  try {
    const { title, description, price, mealType } = req.body;

    const tiffin = await Tiffin.create({
      provider: req.user._id,
      title,
      description,
      price,
      mealType,
    });

    res.status(201).json({
      message: "Tiffin added successfully",
      tiffin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ GET ALL TIFFINS (Customer/Admin) ============
exports.getAllTiffins = async (req, res) => {
  try {
    const tiffins = await Tiffin.find()
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tiffins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
