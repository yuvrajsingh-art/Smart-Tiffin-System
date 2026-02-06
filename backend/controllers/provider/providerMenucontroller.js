const Menu = require("../../models/menu.model");
const Settings = require("../../models/settings.model"); // Import Settings

exports.createOrUpdateMenu = async (req, res) => {
  try {
    const {
      menuDate,
      mealType,
      mainDish,
      sabjiDry,
      dal,
      rice,
      bread,
      accompaniments,
      isSpecialThali,
      specialThaliPrice,
      addOns,
      operationalStatus
    } = req.body;

    // --- CUT-OFF VALIDATION [NEW] ---
    const settings = await Settings.findOne();
    const cutoffTime = settings?.dailyCutoffTime || '10:30'; // Default 10:30 AM

    const today = new Date();
    const menuDateObj = new Date(menuDate);

    // Check if editing "Today's" or "Past" menu
    const isToday = menuDateObj.toDateString() === today.toDateString();

    if (isToday) {
      const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (currentHour > cutoffHour || (currentHour === cutoffHour && currentMinute >= cutoffMinute)) {
        // Allow if 'allowSameDayEdit' is explicitly true (emergency override)
        if (!settings?.allowSameDayEdit) {
          return res.status(400).json({
            success: false,
            message: `Daily cut-off time (${cutoffTime}) has passed. You typically cannot edit today's menu.`
          });
        }
      }
    }

    const menu = await Menu.findOneAndUpdate(
      {
        provider: req.user.id,
        menuDate,
        mealType
      },
      {
        mainDish,
        sabjiDry,
        dal,
        rice,
        bread,
        accompaniments,
        isSpecialThali,
        specialThaliPrice,
        addOns,
        operationalStatus
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Menu saved successfully",
      data: menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.publishMenu = async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  menu.isPublished = true;
  await menu.save();

  res.json({
    success: true,
    message: "Menu published"
  });
};


exports.getTodayMenu = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const menus = await Menu.find({
      isPublished: true,
      menuDate: { $gte: start, $lte: end }
    }).populate("provider", "fullName email");

    res.json({
      success: true,
      count: menus.length,
      data: menus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProviderMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ provider: req.user.id }).sort({ menuDate: 1 });
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch menus"
    });
  }
};
