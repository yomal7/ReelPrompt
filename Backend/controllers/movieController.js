// controllers/movieController.js
const { Movie, Rating, Comment, Favorite, User } = require("../models");
const tmdbService = require("../Services/tmdbService");
const { Op } = require("sequelize");

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tmdbId:
 *           type: integer
 *         title:
 *           type: string
 *         posterUrl:
 *           type: string
 *         backdropUrl:
 *           type: string
 *         overview:
 *           type: string
 *         releaseDate:
 *           type: string
 *           format: date
 *         genres:
 *           type: array
 *         runtime:
 *           type: integer
 *         voteAverage:
 *           type: number
 *         voteCount:
 *           type: integer
 */

// Get popular movies
const getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const movies = await tmdbService.getPopularMovies(page);

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular movies",
    });
  }
};

// Get latest movies
const getLatestMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const movies = await tmdbService.getLatestMovies(page);

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch latest movies",
    });
  }
};

// Search movies
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const movies = await tmdbService.searchMovies(query, page);

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search movies",
    });
  }
};

// Discover movies with filters
const discoverMovies = async (req, res) => {
  try {
    const { page = 1, genre, year, sortBy, minRating, language } = req.query;

    const filters = {};
    if (genre) filters.with_genres = genre;
    if (year) filters.year = year;
    if (sortBy) filters.sortBy = sortBy;
    if (minRating) filters["vote_average.gte"] = minRating;
    if (language) filters.with_original_language = language;

    const movies = await tmdbService.discoverMovies(filters, page);

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Error discovering movies:", error);
    res.status(500).json({
      success: false,
      error: "Failed to discover movies",
    });
  }
};

// Get movie details
const getMovieDetails = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const userId = req.user?.id;

    // Get movie details from TMDB
    const movieDetails = await tmdbService.getMovieDetails(tmdbId);

    // Check if movie exists in our database
    let movie = await Movie.findOne({
      where: { tmdbId: parseInt(tmdbId) },
      include: [
        {
          model: Rating,
          as: "ratings",
          include: [{ model: User, as: "user", attributes: ["username"] }],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["username", "profilePictureUrl"],
            },
          ],
        },
      ],
    });

    // If movie doesn't exist in our DB, create it
    if (!movie) {
      movie = await Movie.create({
        tmdbId: parseInt(tmdbId),
        title: movieDetails.title,
        posterUrl: movieDetails.posterUrl,
        backdropUrl: movieDetails.backdropUrl,
        overview: movieDetails.overview,
        releaseDate: movieDetails.releaseDate,
        genres: movieDetails.genres,
        runtime: movieDetails.runtime,
        voteAverage: movieDetails.voteAverage,
        voteCount: movieDetails.voteCount,
        language: movieDetails.language,
        adult: movieDetails.adult,
      });

      // Reload with associations
      movie = await Movie.findByPk(movie.id, {
        include: [
          {
            model: Rating,
            as: "ratings",
            include: [{ model: User, as: "user", attributes: ["username"] }],
          },
          {
            model: Comment,
            as: "comments",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["username", "profilePictureUrl"],
              },
            ],
          },
        ],
      });
    }

    let userRating = null;
    let isFavorite = false;

    if (userId) {
      // Get user's rating
      const rating = await Rating.findOne({
        where: { userId, movieId: movie.id },
      });
      userRating = rating ? rating.rating : null;

      // Check if movie is in user's favorites
      const favorite = await Favorite.findOne({
        where: { userId, movieId: movie.id },
      });
      isFavorite = !!favorite;
    }

    res.json({
      success: true,
      data: {
        ...movieDetails,
        id: movie.id,
        ratings: movie.ratings,
        comments: movie.comments,
        userRating,
        isFavorite,
        averageRating:
          movie.ratings.length > 0
            ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
              movie.ratings.length
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch movie details",
    });
  }
};

// Get genres
const getGenres = async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();

    res.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch genres",
    });
  }
};

// Rate movie
const rateMovie = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Find or create movie in our database
    let movie = await Movie.findOne({ where: { tmdbId: parseInt(tmdbId) } });

    if (!movie) {
      // Fetch movie details from TMDB and create
      const movieDetails = await tmdbService.getMovieDetails(tmdbId);
      movie = await Movie.create({
        tmdbId: parseInt(tmdbId),
        title: movieDetails.title,
        posterUrl: movieDetails.posterUrl,
        backdropUrl: movieDetails.backdropUrl,
        overview: movieDetails.overview,
        releaseDate: movieDetails.releaseDate,
        genres: movieDetails.genres,
        runtime: movieDetails.runtime,
        voteAverage: movieDetails.voteAverage,
        voteCount: movieDetails.voteCount,
        language: movieDetails.language,
        adult: movieDetails.adult,
      });
    }

    // Create or update rating
    const [userRating, created] = await Rating.upsert({
      userId,
      movieId: movie.id,
      rating,
    });

    res.status(created ? 201 : 200).json({
      success: true,
      data: userRating,
      message: created
        ? "Rating added successfully"
        : "Rating updated successfully",
    });
  } catch (error) {
    console.error("Error rating movie:", error);
    res.status(500).json({
      success: false,
      error: "Failed to rate movie",
    });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Comment content is required",
      });
    }

    // Find or create movie in our database
    let movie = await Movie.findOne({ where: { tmdbId: parseInt(tmdbId) } });

    if (!movie) {
      const movieDetails = await tmdbService.getMovieDetails(tmdbId);
      movie = await Movie.create({
        tmdbId: parseInt(tmdbId),
        title: movieDetails.title,
        posterUrl: movieDetails.posterUrl,
        backdropUrl: movieDetails.backdropUrl,
        overview: movieDetails.overview,
        releaseDate: movieDetails.releaseDate,
        genres: movieDetails.genres,
        runtime: movieDetails.runtime,
        voteAverage: movieDetails.voteAverage,
        voteCount: movieDetails.voteCount,
        language: movieDetails.language,
        adult: movieDetails.adult,
      });
    }

    // Create comment
    const comment = await Comment.create({
      userId,
      movieId: movie.id,
      content: content.trim(),
    });

    // Get comment with user details
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "profilePictureUrl"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: commentWithUser,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add comment",
    });
  }
};

// Toggle favorite
const toggleFavorite = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const userId = req.user.id;

    // Find or create movie in our database
    let movie = await Movie.findOne({ where: { tmdbId: parseInt(tmdbId) } });

    if (!movie) {
      const movieDetails = await tmdbService.getMovieDetails(tmdbId);
      movie = await Movie.create({
        tmdbId: parseInt(tmdbId),
        title: movieDetails.title,
        posterUrl: movieDetails.posterUrl,
        backdropUrl: movieDetails.backdropUrl,
        overview: movieDetails.overview,
        releaseDate: movieDetails.releaseDate,
        genres: movieDetails.genres,
        runtime: movieDetails.runtime,
        voteAverage: movieDetails.voteAverage,
        voteCount: movieDetails.voteCount,
        language: movieDetails.language,
        adult: movieDetails.adult,
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      where: { userId, movieId: movie.id },
    });

    if (existingFavorite) {
      // Remove from favorites
      await existingFavorite.destroy();

      res.json({
        success: true,
        isFavorite: false,
        message: "Movie removed from favorites",
      });
    } else {
      // Add to favorites
      await Favorite.create({
        userId,
        movieId: movie.id,
      });

      res.json({
        success: true,
        isFavorite: true,
        message: "Movie added to favorites",
      });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle favorite",
    });
  }
};

module.exports = {
  getPopularMovies,
  getLatestMovies,
  searchMovies,
  discoverMovies,
  getMovieDetails,
  getGenres,
  rateMovie,
  addComment,
  toggleFavorite,
};
