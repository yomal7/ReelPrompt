require("dotenv").config();
const { spawn } = require("child_process");

const env = {
  ...process.env,
  PGPASSWORD: process.env.DB_PASSWORD, // Ensure password is available
};

console.log("Connecting with:");
console.log("- Host:", process.env.DB_HOST);
console.log("- Database:", process.env.DB_NAME);
console.log("- User:", process.env.DB_USER);
console.log("- Password:", process.env.DB_PASSWORD ? "(set)" : "(not set)");

// Run sequelize migration with environment variables
const migrate = spawn("npx", ["sequelize-cli", "db:migrate"], {
  env,
  stdio: "inherit",
  shell: true,
});

migrate.on("close", (code) => {
  if (code !== 0) {
    console.error(`Migration failed with code ${code}`);
    process.exit(code);
  }
});
