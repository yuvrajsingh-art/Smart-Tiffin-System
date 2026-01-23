const Provider = require("../models/providerprofile.model");

const auth = require("../middleware/authMiddleware.middleware")

// CREATE or UPDATE PROVIDER PROFILE
exports.upsertProviderProfile = async (req, res) => {
  try {
    const {
      kitchenName,
      phone,
      address,
      latitude,
      longitude,
      services
    } = req.body;

    // basic validation
    if (!kitchenName || !phone || !latitude || !longitude) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const providerData = {
      user: req.user.id, // auth middleware se aayega
      kitchenName,
      phone,
      address,
      services,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    };

    const provider = await Provider.findOneAndUpdate(
      { user: req.user.id },
      providerData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Provider profile saved successfully",
      provider
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


exports.getMyProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id })
      .populate("user", "name email");

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found"
      });
    }

    res.json(provider);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



exports.toggleAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const provider = await Provider.findOneAndUpdate(
      { user: req.user.id },
      { isAvailable },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found"
      });
    }

    res.json({
      message: "Availability updated",
      isAvailable: provider.isAvailable
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


exports.getNearbyProviders = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude & Longitude required"
      });
    }

    const providers = await Provider.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 5000 // 5 KM radius
        }
      },
      isAvailable: true
    }).populate("user", "name");

    res.json({
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


exports.deleteProviderProfile = async (req, res) => {
  try {
    await Provider.findOneAndDelete({ user: req.user.id });

    res.json({
      message: "Provider profile deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
