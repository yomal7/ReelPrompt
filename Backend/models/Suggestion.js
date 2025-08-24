const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Suggestion = sequelize.define(
  "Suggestion",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 500],
      },
    },
    suggestedMovies: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: "suggested_movies",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    tableName: "suggestions",
    underscored: true,
    timestamps: true,
  }
);

Suggestion.associate = (models) => {
  Suggestion.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

module.exports = Suggestion;
