// middleware/authorizeRoles.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
