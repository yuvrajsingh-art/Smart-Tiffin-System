const Menu = require("../../models/menu.model");
const Settings = require("../../models/settings.model");

exports.createMenu = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      type,
      mealType,
      items,
      calories,
      menuLabel,
      menuDate,
      isHoliday,
      image,
      description,
      availableDays
    } = req.body;

    // --- CUT-OFF VALIDATION ---
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const targetDate = menuDate ? new Date(menuDate) : new Date();
    const isToday = targetDate.toDateString() === now.toDateString();

    if (isToday) {
      if (mealType === 'lunch' && (currentHour > 10 || (currentHour === 10 && currentMinute >= 30))) {
        return res.status(400).json({ success: false, message: 'Lunch cut-off (10:30 AM) passed.' });
      }
      if (mealType === 'dinner' && currentHour >= 17) {
        return res.status(400).json({ success: false, message: 'Dinner cut-off (5:00 PM) passed.' });
      }
    }

    const newMenu = new Menu({
      provider: req.user.id,
      name,
      price: parseInt(price) || 0,
      category: category || 'Thali',
      type: type || 'Veg',
      mealType,
      items,
      calories: parseInt(calories) || 0,
      menuLabel,
      menuDate: targetDate,
      isHoliday: isHoliday || false,
      image,
      description,
      availableDays: availableDays || [],
      isPublished: true,
      isAvailable: true
    });

    await newMenu.save();

    res.status(201).json({
      success: true,
      message: "Menu created successfully",
      data: newMenu
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.price) updateData.price = parseInt(updateData.price);
    if (updateData.calories) updateData.calories = parseInt(updateData.calories);

    const menu = await Menu.findOneAndUpdate(
      { _id: id, provider: req.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    res.json({
      success: true,
      message: "Menu updated successfully",
      data: menu
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const menus = await Menu.find({
      provider: providerId,
      isPublished: true,
      menuDate: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });

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

// Get menu history - all past menus
exports.getMenuHistory = async (req, res) => {
  try {
    const providerId = req.user?._id || req.user?.id;

    const menus = await Menu.find({
      provider: providerId
    })
      .sort({ createdAt: -1 })
      .limit(50);

    // Group by date
    const grouped = {};
    menus.forEach(menu => {
      const dateKey = menu.createdAt.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey, lunch: null, dinner: null };
      }
      if (menu.mealType === 'lunch' && !grouped[dateKey].lunch) {
        grouped[dateKey].lunch = menu;
      }
      if (menu.mealType === 'dinner' && !grouped[dateKey].dinner) {
        grouped[dateKey].dinner = menu;
      }
    });

    res.json({
      success: true,
      data: Object.values(grouped).slice(0, 14) // Last 14 days
    });

  } catch (error) {
    console.error('getMenuHistory error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
