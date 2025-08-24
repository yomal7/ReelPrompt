// test-db.js - Create this file in Backend folder
require("dotenv").config();
const { Client } = require("pg");

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log("🔄 Testing database connection...");
    console.log("Host:", process.env.DB_HOST);
    console.log("Port:", process.env.DB_PORT);
    console.log("Database:", process.env.DB_NAME);
    console.log("User:", process.env.DB_USER);
    console.log("Password:", process.env.DB_PASSWORD ? "***" : "NOT SET");

    await client.connect();
    console.log("✅ Database connection successful!");

    const result = await client.query("SELECT version()");
    console.log("📊 PostgreSQL Version:", result.rows[0].version);

    await client.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
