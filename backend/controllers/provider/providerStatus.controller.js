const Provider = require("../../models/providerprofile.model");

exports.toggleKitchenStatus = async (req, res) => {
  try {
    const { kitchenStatus } = req.body;

    const provider = await Provider.findOneAndUpdate(
      { user: req.user.id },
      { kitchenStatus },
      { new: true }
    );

    res.json({
      success: true,
      message: `Kitchen turned ${kitchenStatus ? "ON" : "OFF"}`,
      kitchenStatus: provider.kitchenStatus
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
