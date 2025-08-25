const express = require("express");
const { getSuggestions } = require("../controllers/suggestionController");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Suggestions
 *   description: AI-powered movie recommendations based on user prompts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SuggestionRequest:
 *       type: object
 *       required:
 *         - prompt
 *       properties:
 *         prompt:
 *           type: string
 *           description: Description of what kind of movie you want
 *           example: "I want to watch a sci-fi movie with time travel and action"
 *     SuggestionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               tmdbId:
 *                 type: integer
 *                 example: 550
 *               title:
 *                 type: string
 *                 example: "Fight Club"
 *               overview:
 *                 type: string
 *                 example: "A ticking-time-bomb insomniac..."
 *               posterUrl:
 *                 type: string
 *                 example: "https://image.tmdb.org/t/p/w500/..."
 *               backdropUrl:
 *                 type: string
 *                 example: "https://image.tmdb.org/t/p/original/..."
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "1999-10-15"
 *               voteAverage:
 *                 type: number
 *                 example: 8.4
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Drama", "Thriller"]
 */

/**
 * @swagger
 * /api/suggestions:
 *   post:
 *     summary: Get AI-powered movie suggestions
 *     description: Get personalized movie recommendations based on your prompt using AI similarity matching
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuggestionRequest'
 *           examples:
 *             sci-fi:
 *               summary: Sci-fi request
 *               value:
 *                 prompt: "I want to watch a sci-fi movie with time travel and action"
 *             comedy:
 *               summary: Comedy request
 *               value:
 *                 prompt: "Funny romantic comedies from the 90s"
 *             horror:
 *               summary: Horror request
 *               value:
 *                 prompt: "Scary horror movies with zombies"
 *     responses:
 *       200:
 *         description: Movie suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuggestionResponse'
 *       400:
 *         description: Prompt is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Prompt is required"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No token provided, authorization denied"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to get suggestions"
 */
router.post("/", auth, getSuggestions);

module.exports = router;
