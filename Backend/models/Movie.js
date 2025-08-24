const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Movie = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "tmdb_id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "poster_url",
    },
    backdropUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "backdrop_url",
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "release_date",
    },
    genres: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    runtime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    voteAverage: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      field: "vote_average",
    },
    voteCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "vote_count",
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "en",
    },
    adult: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "movies",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ["tmdb_id"],
        unique: true,
      },
      {
        fields: ["title"],
      },
      {
        fields: ["release_date"],
      },
    ],
  }
);

Movie.associate = (models) => {
  Movie.hasMany(models.Rating, {
    foreignKey: "movieId",
    as: "ratings",
  });
  Movie.hasMany(models.Comment, {
    foreignKey: "movieId",
    as: "comments",
  });
  Movie.hasMany(models.Favorite, {
    foreignKey: "movieId",
    as: "favorites",
  });
};

module.exports = Movie;
