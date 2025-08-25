// yomal7/reelprompt/ReelPrompt-express_backend/Backend/Services/suggestionService.js
const tmdbService = require("./tmdbService");

class SuggestionService {
  constructor() {
    this.model = null;
    this.transformers = null;
    this.moviePool = []; // Cache for the movie pool
    this.isBuildingPool = false; // Flag to prevent concurrent builds
  }

  async initialize() {
    if (!this.transformers) {
      // Use dynamic import for ESM compatibility
      this.transformers = await import("@xenova/transformers");
    }

    if (!this.model) {
      console.log("🚀 Initializing AI model...");
      this.model = await this.transformers.pipeline(
        "feature-extraction",
        "Xenova/bge-small-en-v1.5" // Using the better retrieval model
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
      console.warn("Movie pool is empty, using fallback.");
      const popular = await tmdbService.getPopularMovies();
      return popular.results.slice(0, 5);
    }

    console.log(`📚 Using ${this.moviePool.length} movies for suggestions`);

    const moviesWithOverviews = this.moviePool.filter(
      (movie) => movie.overview && movie.overview.trim().length > 20
    );
    console.log(`📝 ${moviesWithOverviews.length} movies have valid overviews`);

    if (moviesWithOverviews.length === 0) {
      return this.moviePool.slice(0, 5);
    }

    // 🔧 BATCH PROCESSING TO PREVENT MEMORY ISSUES
    const BATCH_SIZE = 100; // Process 100 movies at a time
    const MAX_MOVIES_TO_PROCESS = 3000; // Limit total movies to process

    // Limit the number of movies to process
    const moviesToProcess = moviesWithOverviews.slice(0, MAX_MOVIES_TO_PROCESS);
    console.log(
      `⚡ Processing ${moviesToProcess.length} movies in batches of ${BATCH_SIZE}`
    );

    // Get prompt embedding once
    console.log("🧠 Creating prompt embedding...");
    const promptEmbedding = await this.model(prompt, {
      pooling: "mean",
      normalize: true,
    });

    const allScores = [];

    // Process movies in batches
    for (let i = 0; i < moviesToProcess.length; i += BATCH_SIZE) {
      const batch = moviesToProcess.slice(i, i + BATCH_SIZE);
      const batchOverviews = batch.map((movie) => movie.overview);

      console.log(
        `🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          moviesToProcess.length / BATCH_SIZE
        )} (${batch.length} movies)`
      );

      try {
        // Create embeddings for this batch
        const batchEmbeddings = await this.model(batchOverviews, {
          pooling: "mean",
          normalize: true,
        });

        // Calculate similarity scores for this batch
        for (let j = 0; j < batchEmbeddings.length; j++) {
          const score = this.transformers.cos_sim(
            promptEmbedding.data,
            batchEmbeddings[j].data
          );
          allScores.push({ movie: batch[j], score });
        }

        // Small delay to prevent overwhelming the system
        await new Promise((resolve) => setTimeout(resolve, 10));
      } catch (batchError) {
        console.error(
          `❌ Error processing batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
          batchError.message
        );
        // Continue with next batch
      }
    }

    console.log(`✅ Processed ${allScores.length} movies successfully`);

    // Sort all scores
    allScores.sort((a, b) => b.score - a.score);

    console.log("🏆 Top 10 similarity scores:");
    allScores.slice(0, 10).forEach((item, index) => {
      console.log(
        `  ${index + 1}. ${item.movie.title}: ${item.score.toFixed(4)}`
      );
    });

    // Use a lower threshold since we're processing fewer movies
    const minScore = 0.3;
    let topMovies = allScores
      .filter((s) => s.score > minScore)
      .map((s) => s.movie);

    // Fallback to top scored movies
    if (topMovies.length < 5) {
      console.log(
        "⚠️ Not enough movies above threshold, returning top scored movies"
      );
      topMovies = allScores.slice(0, 5).map((s) => s.movie);
    }

    const finalSuggestions = topMovies.slice(0, 5);
    console.log(`✅ Returning ${finalSuggestions.length} suggestions`);
    return finalSuggestions;
  }
}

module.exports = new SuggestionService();
