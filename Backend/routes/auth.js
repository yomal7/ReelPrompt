const express = require("express");
const { signup, signin, getProfile } = require("../controllers/authController");
const { validateSignup, validateSignin } = require("../middleware/validation");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and profile management
 */

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);

// Protected routes
router.get("/me", auth, getProfile);

module.exports = router;
