const jwt = require("jsonwebtoken");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided, authorization denied",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Token is not valid - user not found",
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return res.status(401).json({
        success: false,
        error: "Token is not valid",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Server error in authentication",
    });
  }
};

module.exports = auth;
