// yomal7/reelprompt/ReelPrompt-express_backend/Backend/Services/suggestionService.js
const { pipeline, cos_sim } = require("@xenova/transformers");
const tmdbService = require("./tmdbService");

class SuggestionService {
  constructor() {
    this.model = null;
  }

  async initialize() {
    if (!this.model) {
      this.model = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }
  }

  async getSuggestions(prompt) {
    await this.initialize();

    // 1. Fetch a pool of movies to search from (e.g., popular movies)
    const popularMovies = await tmdbService.getPopularMovies();
    const movieOverviews = popularMovies.results.map((movie) => movie.overview);

    // 2. Create embeddings for the user's prompt and movie overviews
    const promptEmbedding = await this.model(prompt, {
      pooling: "mean",
      normalize: true,
    });

    const movieEmbeddings = await this.model(movieOverviews, {
      pooling: "mean",
      normalize: true,
    });

    // 3. Calculate similarity scores
    const scores = [];
    for (let i = 0; i < movieEmbeddings.length; i++) {
      const score = cos_sim(promptEmbedding.data, movieEmbeddings[i].data);
      scores.push({ movie: popularMovies.results[i], score });
    }

    // 4. Sort by score and return the top results
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, 5).map((s) => s.movie); // Return top 5 movies
  }
}

module.exports = new SuggestionService();
