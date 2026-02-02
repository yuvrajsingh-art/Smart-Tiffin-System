const ProviderProfile = require("../../models/providerprofile.model");

/* STEP 1 – IDENTITY */
exports.saveIdentity = async (req, res) => {
  try {
    const { messName, ownerName, phone, logo, address, city, pincode } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        messName,
        ownerName,
        phone,
        logo,
        location: {
          address: address || "Pending",
          city: city || "Pending",
          pincode: pincode || "000000"
        },
        onboardingStep: 2
      },
      { new: true, upsert: true }
    );

    res.json({ message: "Identity saved", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* STEP 2 – LEGAL */
exports.saveLegal = async (req, res) => {
  try {
    const { fssaiNumber, fssaiCertificate } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        fssaiNumber,
        fssaiCertificate,
        onboardingStep: 3
      },
      { new: true }
    );

    res.json({ message: "Legal details saved", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* STEP 3 – OPERATIONS */
exports.saveOperations = async (req, res) => {
  try {
    const {
      address,
      latitude,
      longitude,
      deliveryRadius,
      orderCutoffTime
    } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        address,
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        deliveryRadius,
        orderCutoffTime,
        onboardingStep: 4
      },
      { new: true }
    );

    res.json({ message: "Operations saved", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* STEP 4 – BANKING */
exports.saveBanking = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        bankDetails: {
          accountHolderName,
          accountNumber,
          ifscCode
        },
        isOnboardingComplete: true
      },
      { new: true }
    );

    res.json({ message: "Onboarding completed 🎉", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
