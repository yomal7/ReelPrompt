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
      // Don't close connection here - wait until all operations complete
      return;
    }

    // Create admin user
    console.log("🔄 Creating admin user...");
    const admin = await User.create({
      username: "admin",
      email: "admin@movieapp.com",
      password: "Admin123!",
      name: "System Administrator",
      role: "admin",
    });

    console.log("✅ Admin created successfully:", admin.email);

    // Don't call any additional operations after this point
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    // Close connection only once at the end of the function
    console.log("🔄 Closing database connection...");
    await sequelize.close();
    console.log("✅ Connection closed");
  }
}

// Execute the function and properly handle the promise
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log("✅ Script completed");
      process.exit(0); // Exit with success code
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1); // Exit with error code
    });
}

module.exports = createAdmin;
