const  {Menu}  = require("../../models/menu.model");

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
