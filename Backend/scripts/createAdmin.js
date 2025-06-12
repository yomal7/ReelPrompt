const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit();
  }
  const hashedPassword = await bcrypt.hash("12345678a", 12);
  const admin = new User({
    username: "admin",
    email: "admin@reelprompt.com",
    password: hashedPassword,
    role: "admin",
  });
  await admin.save();
  console.log("Admin user created!");
  process.exit();
}

createAdmin();
