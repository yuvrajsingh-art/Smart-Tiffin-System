const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= TOKEN GENERATOR =================
const genToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= REGISTER =================
exports.registerCustomer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      address,
      latitude,
      longitude
    } = req.body;

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role: "customer",
      address
    };

    // 🔹 Location store only if frontend sends it
    if (latitude && longitude) {
      userData.location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
    }

    const user = await User.create(userData);
    const token = genToken(user._id);

    res.status(201).json({
      message: "Customer registered successfully",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.providerCustomer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      address,
      latitude,
      longitude
    } = req.body;

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role: "provider",
      address
    };

    // 🔹 Location store only if frontend sends it
    if (latitude && longitude) {
      userData.location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
    }

    const user = await User.create(userData);
    const token = genToken(user._id);

    res.status(201).json({
      message: "Customer registered successfully",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "sign out successfully" });
    } catch (error) {
        return res.status(500).json(`sign out error ${error}`)
    }
}


exports.googleAuth = async (req, res) => {
   try {
    const {fullName,email,mobile,role}=req.body
    let user =await User.findOne({email})
    if (!user) {
       user=await User.create({
        fullName,email,mobile,role
       })   
    }
    const token = await genToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        
        return res.status(200).json(user)

   } catch (error) {
    return res.status(500).json(`googleAuth error ${error}`)
   } 
}