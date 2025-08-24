const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

// Comment Model
const Comment = sequelize.define(
  "Comment",
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 1000],
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
    tableName: "comments",
    underscored: true,
    timestamps: true,
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  Comment.belongsTo(models.Movie, {
    foreignKey: "movieId",
    as: "movie",
  });
};

module.exports = Comment;
