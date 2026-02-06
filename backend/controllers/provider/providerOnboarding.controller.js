const ProviderProfile = require("../../models/providerprofile.model");

/* STEP 1 – IDENTITY */
exports.saveIdentity = async (req, res) => {
  try {
    const { messName, ownerName, phone, logo, address, city, pincode } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          user: req.user.id,
          messName,
          ownerName,
          phone,
          profileImage: logo,
          "location.type": "Point",
          "location.coordinates": [75.8577, 22.7196], // Default Indore
          "location.address": address || "Pending",
          "location.city": city || "Pending",
          "location.pincode": pincode || "000000",
          onboardingStep: 2
        }
      },
      { new: true, upsert: true }
    );

    res.json({ message: "Identity saved", profile });
  } catch (err) {
    console.error("❌ Onboarding Identity Error:", err.message);
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
        $set: {
          fssaiNumber,
          fssaiCertificate,
          onboardingStep: 3
        }
      },
      { new: true }
    );

    res.json({ message: "Legal details saved", profile });
  } catch (err) {
    console.error("❌ Onboarding Legal Error:", err.message);
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
        $set: {
          "location.coordinates": [longitude, latitude],
          "location.address": address, // Update with precise address
          deliveryRadius,
          orderCutoffTime,
          onboardingStep: 4
        }
      },
      { new: true }
    );

    res.json({ message: "Operations saved", profile });
  } catch (err) {
    console.error("❌ Onboarding Operations Error:", err.message);
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
        $set: {
          bankDetails: {
            accountHolderName,
            accountNumber,
            ifscCode
          },
          isOnboardingComplete: true
        }
      },
      { new: true }
    );

    // Sync to StoreProfile so it appears in Discovery
    const StoreProfile = require("../../models/storeProfile.model");
    await StoreProfile.findOneAndUpdate(
      { provider: req.user.id },
      {
        $set: {
          provider: req.user.id,
          mess_name: profile.messName,
          contact_number: profile.phone,
          description: profile.description,
          "address.street": profile.location.address,
          "address.city": profile.location.city,
          "address.pincode": profile.location.pincode,
          "location.coordinates": profile.location.coordinates,
          is_active: true
        }
      },
      { upsert: true }
    );

    res.json({ message: "Onboarding completed 🎉", profile });
  } catch (err) {
    console.error("❌ Onboarding Banking Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
