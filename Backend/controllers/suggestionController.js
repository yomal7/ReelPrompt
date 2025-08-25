// yomal7/reelprompt/ReelPrompt-express_backend/Backend/controllers/suggestionController.js
const { Suggestion } = require("../models");
const suggestionService = require("../Services/suggestionService");

const getSuggestions = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id;

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, error: "Prompt is required" });
    }

    const suggestedMovies = await suggestionService.getSuggestions(prompt);

    // Save the suggestion to the database
    await Suggestion.create({
      userId,
      prompt,
      suggestedMovies: suggestedMovies.map((movie) => movie.tmdbId),
    });

    res.json({ success: true, data: suggestedMovies });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to get suggestions" });
  }
};

module.exports = {
  getSuggestions,
};
