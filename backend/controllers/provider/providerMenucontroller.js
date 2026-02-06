const  Menu  = require("../../models/menu.model");
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
  operationalStatus,
  image,
  description
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
    const today = new Date().toLocaleString("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata"
    });

    const menus = await Menu.find({
      isPublished: true,
      availableDays: today,
      mealType: { $in: ["lunch", "dinner"] }
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
