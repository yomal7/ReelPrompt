const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    await mongoose.disconnect();
    process.exit();
  }
  const admin = new User({
    username: "admin",
    email: "admin@reelprompt.com",
    password: "12345678a",
    role: "admin",
  });
  await admin.save();
  console.log("Admin user created!");
  await mongoose.disconnect();
  process.exit();
}

createAdmin();
