// routes/users.js
const express = require("express");
const {
  updateProfile,
  changePassword,
  getFavorites,
  getRatings,
  getComments,
  getUserStats,
  deleteAccount,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const {
  validateUpdateProfile,
  validateChangePassword,
} = require("../middleware/validation");
const Joi = require("joi");

const router = express.Router();

// Validation schema for account deletion
const deleteAccountSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Password is required to delete account",
  }),
});

const { validate } = require("../middleware/validation");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management and activity
 */

// All routes require authentication
router.use(auth);

// Profile management
router.put("/profile", validateUpdateProfile, updateProfile);
router.put("/change-password", validateChangePassword, changePassword);

// User activity
router.get("/favorites", getFavorites);
router.get("/ratings", getRatings);
router.get("/comments", getComments);
router.get("/stats", getUserStats);

// Account deletion
router.delete("/account", validate(deleteAccountSchema), deleteAccount);

module.exports = router;
