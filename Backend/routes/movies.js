// routes/movies.js
const express = require("express");
const {
  getPopularMovies,
  getLatestMovies,
  searchMovies,
  discoverMovies,
  getMovieDetails,
  getGenres,
  rateMovie,
  addComment,
  toggleFavorite,
} = require("../controllers/movieController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const Joi = require("joi");

const router = express.Router();

// Validation schemas
const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie data and user interactions
 */

// Public routes - no authentication required
router.get("/popular", getPopularMovies);
router.get("/latest", getLatestMovies);
router.get("/search", searchMovies);
router.get("/discover", discoverMovies);
router.get("/genres", getGenres);
router.get("/:tmdbId", getMovieDetails); // Can work without auth but shows more data when authenticated

// Protected routes - authentication required
router.post("/:tmdbId/rate", auth, validate(ratingSchema), rateMovie);
router.post("/:tmdbId/comment", auth, validate(commentSchema), addComment);
router.post("/:tmdbId/favorite", auth, toggleFavorite);

module.exports = router;
