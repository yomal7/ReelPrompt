const { sequelize, User } = require("../models");
require("dotenv").config();

async function createAdmin() {
  try {
    console.log("🔄 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      console.log("ℹ️ Admin already exists:", existingAdmin.email);
      console.log("👤 Username:", existingAdmin.username);
      await sequelize.close();
      return;
    }

    // Create admin user
    console.log("🔄 Creating admin user...");
    const admin = await User.create({
      username: "admin",
      email: "admin@movieapp.com",
      passwordHash: "Admin123!", // Will be hashed by the model
      name: "System Administrator",
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("👤 Username:", admin.username);
    console.log("🔑 Password: Admin123!");
    console.log("");
    console.log("⚠️  Please change the password after first login!");

    await sequelize.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log("🎉 Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

module.exports = createAdmin;
