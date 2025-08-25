// yomal7/reelprompt/ReelPrompt-express_backend/Backend/Services/suggestionService.js
const tmdbService = require("./tmdbService");

class SuggestionService {
  constructor() {
    this.model = null;
    this.transformers = null;
    this.moviePool = [];
    this.isBuildingPool = false;
  }

  async initialize() {
    if (!this.transformers) {
      this.transformers = await import("@xenova/transformers");
    }

    if (!this.model) {
      console.log("🚀 Initializing AI model...");
      // Use the specialized movie recommendation model
      this.model = await this.transformers.pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
      console.log("✅ AI model initialized.");
    }

    if (this.moviePool.length === 0 && !this.isBuildingPool) {
      this.isBuildingPool = true;
      try {
        this.moviePool = await tmdbService.getMoviePoolForSuggestions();
      } finally {
        this.isBuildingPool = false;
      }
    }
  }

  async getSuggestions(prompt) {
    await this.initialize();

    console.log(`🎬 Processing suggestion for: "${prompt}"`);

    if (this.moviePool.length === 0) {
      console.warn(
        "Movie pool is not ready, returning popular movies as fallback."
      );
      const popular = await tmdbService.getPopularMovies();
      return popular.results.slice(0, 10);
    }

    const moviesWithOverviews = this.moviePool.filter(
      (movie) => movie.overview && movie.overview.trim().length > 20
    );

    if (moviesWithOverviews.length === 0) {
      console.warn("No movies with overviews found, returning from pool.");
      return this.moviePool.slice(0, 10);
    }

    console.log(
      `📝 Using ${moviesWithOverviews.length} movies with valid overviews for suggestions`
    );

    // Create embedding for the user's prompt
    const promptEmbedding = await this.model(prompt, {
      pooling: "mean",
      normalize: true,
    });

    const allScores = [];

    // **FIXED & OPTIMIZED BATCH PROCESSING**
    // Process all available movies in manageable chunks
    const BATCH_SIZE = 50;
    for (let i = 0; i < moviesWithOverviews.length; i += BATCH_SIZE) {
      const batch = moviesWithOverviews.slice(i, i + BATCH_SIZE);
      const batchOverviews = batch.map((movie) => movie.overview);

      const batchEmbeddings = await this.model(batchOverviews, {
        pooling: "mean",
        normalize: true,
      });

      // **BUG FIX**: Correctly iterate over the batch and calculate similarity
      for (let j = 0; j < batch.length; j++) {
        const movieEmbedding = batchEmbeddings[j].data;
        const score = this.transformers.cos_sim(
          promptEmbedding.data,
          movieEmbedding
        );
        allScores.push({ movie: batch[j], score });
      }
    }

    // Sort all movies by their similarity score in descending order
    allScores.sort((a, b) => b.score - a.score);

    console.log("🏆 Top 5 similarity scores:");
    allScores.slice(0, 5).forEach((item, index) => {
      console.log(
        `  ${index + 1}. ${item.movie.title}: ${item.score.toFixed(4)}`
      );
    });

    // **IMPROVED FALLBACK LOGIC**
    // Even if no movie meets a high similarity threshold, we should still provide the best possible matches.
    const suggestions = allScores.slice(0, 10).map((s) => s.movie);

    console.log(`✅ Returning ${suggestions.length} suggestions.`);
    return suggestions;
  }
}

module.exports = new SuggestionService();
