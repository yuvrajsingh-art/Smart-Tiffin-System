const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // 1. Check user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      },
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