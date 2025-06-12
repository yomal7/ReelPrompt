const express = require("express");
const { signup, signin } = require("../controllers/authController");
const { validateSignup, validateSignin } = require("../middleware/validation");
const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);

module.exports = router;
