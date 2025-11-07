const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Make sure the path to your User model is correct

const veryfyToken = async (req, res, next) => {
  try {
    let token;

    // 1) Prefer Authorization header (Bearer <token>) to support API clients
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) Fallback to cookie token if header not provided
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Token is not available" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // after decode search user in db
    const userFound = await User.findById(decoded.id);
    if (!userFound) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach minimal user info to request (avoid sending password)
    req.user = {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    };
    return next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = veryfyToken;
