const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if user is already registered and try to register again
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "User already registered" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    // create token for the new user
    const userInfo = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      // Don't include password in JWT
    };

    const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      username: newUser.username,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const userFound = await User.findOne({ email });
  if (!userFound) {
    return res.status(400).json({ message: "invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, userFound.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "invalid credentials" });
  }
  if (userFound && isPasswordValid) {
    const userInfo = {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    };
    const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({
      message: "login successful",
      username: userFound.username,
      token,
    });
  } else {
    res.status(400).json({ message: "invalid credentials" });
  }
};
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logout successful" });
};
// Add this new function
const getUser = async (req, res) => {
  try {
    // req.user.id is added by your authMiddleware
    // We select '-password' to *exclude* the password from the response
    const foundUser = await User.findById(req.user.id).select("-password");
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(foundUser);
  } catch (err) {
    console.error("getUser error:", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { registerUser, loginUser, logoutUser, getUser };
