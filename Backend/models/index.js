const { sequelize } = require("../db/connection");

// Import all models
const User = require("./User");
const Movie = require("./Movie");
const Rating = require("./Rating");
const Comment = require("./Comment");
const Favorite = require("./Favorite");
const Suggestion = require("./Suggestion");

// Define associations
const models = {
  User,
  Movie,
  Rating,
  Comment,
  Favorite,
  Suggestion,
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sync database (only in development)
if (process.env.NODE_ENV === "development") {
  sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Database models synchronized");
  });
}

module.exports = {
  sequelize,
  ...models,
};
