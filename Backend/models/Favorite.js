const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Favorite = sequelize.define(
  "Favorite",
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
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "movie_id",
      references: {
        model: "movies",
        key: "id",
      },
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
    tableName: "favorites",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ["user_id", "movie_id"],
        unique: true,
      },
    ],
  }
);

Favorite.associate = (models) => {
  Favorite.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  Favorite.belongsTo(models.Movie, {
    foreignKey: "movieId",
    as: "movie",
  });
};

module.exports = Favorite;
