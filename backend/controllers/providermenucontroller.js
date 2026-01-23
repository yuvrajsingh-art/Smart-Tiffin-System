const Menu = require("../models/menu.model");

/**
 * PROVIDER: Daily Menu Upload/update
 */
exports.createOrUpdateMenu = async (req, res) => {
  try {
    const {
      menuDate,
      mealType,
      items,
      calories,
      isVeg,
      isAvailable,
      plan
    } = req.body;

    const providerId = req.user._id; // auth middleware se

    const menu = await Menu.findOneAndUpdate(
      { provider: providerId, menuDate, mealType },
      {
        provider: providerId,
        plan,
        menuDate,
        mealType,
        items,
        calories,
        isVeg,
        isAvailable
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Menu uploaded/updated successfully",
      menu
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * PROVIDER: Get Own Menus
 */
exports.getMyMenus = async (req, res) => {
  try {
    const providerId = req.user._id;

    const menus = await Menu.find({ provider: providerId })
      .sort({ menuDate: -1 });

    res.json({ success: true, menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PROVIDER: Delete Menu
 */
exports.deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Menu deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
