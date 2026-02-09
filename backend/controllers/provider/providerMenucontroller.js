const Menu = require("../../models/menu.model");
const Settings = require("../../models/settings.model"); // Import Settings
console.log("Menu model 👉", Menu);
console.log("Settings model 👉", Settings);

exports.createOrUpdateMenu = async (req, res) => {
  try {
    const {
  name,
  price,
  category,
  type,
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
  operationalStatus,
  image,
  description
} = req.body;

    // --- CUT-OFF VALIDATION [SIMPLIFIED] ---
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Lunch cutoff: 10:30 AM
    // Dinner cutoff: 5:00 PM (17:00)
    if (mealType === 'lunch' && (currentHour > 10 || (currentHour === 10 && currentMinute >= 30))) {
      return res.status(400).json({
        success: false,
        message: 'Lunch cut-off time (10:30 AM) has passed. Cannot add/edit lunch menu for today.'
      });
    }
    
    if (mealType === 'dinner' && currentHour >= 17) {
      return res.status(400).json({
        success: false,
        message: 'Dinner cut-off time (5:00 PM) has passed. Cannot add/edit dinner menu for today.'
      });
    }

    const menu = await Menu.findOneAndUpdate(
  {
    provider: req.user.id,
    mealType,
    availableDays: req.body.availableDays
  },
  {
    name,
    price,
    category,
    type,
    image,
    description,
    mainDish,
    sabjiDry,
    dal,
    rice,
    bread,
    accompaniments,
    isSpecialThali,
    specialThaliPrice,
    addOns,
    operationalStatus,
    availableDays: req.body.availableDays,
    isPublished: req.body.isPublished || true,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
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
    const providerId = req.user?._id || req.user?.id;
    console.log('getTodayMenu - Provider ID:', providerId);
    
    const menus = await Menu.find({
      provider: providerId,
      isPublished: true,
      mealType: { $in: ["lunch", "dinner"] }
    }).sort({ createdAt: -1 });

    console.log('Found menus:', menus.length);

    res.json({
      success: true,
      count: menus.length,
      data: menus
    });

  } catch (error) {
    console.error('getTodayMenu error:', error);
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
