const Menu = require("../models/menu.model");

/**
 * CUSTOMER: View Menu by Date
 */
exports.getMenusByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const menus = await Menu.find({
      menuDate: new Date(date),
      isAvailable: true
    })
      .populate("provider", "name")
      .populate("plan", "name");

    res.json({ success: true, menus });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CUSTOMER: View Menu by Provider
 */
exports.getProviderMenus = async (req, res) => {
  try {
    const menus = await Menu.find({
      provider: req.params.providerId,
      isAvailable: true
    });

    res.json({ success: true, menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
