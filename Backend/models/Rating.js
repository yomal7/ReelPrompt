const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Rating = sequelize.define(
  "Rating",
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
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
    tableName: "ratings",
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

Rating.associate = (models) => {
  Rating.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  Rating.belongsTo(models.Movie, {
    foreignKey: "movieId",
    as: "movie",
  });
};

module.exports = Rating;
