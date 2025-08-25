const tmdbService = require("./tmdbService");

class SuggestionService {
  constructor() {
    this.model = null;
    this.transformers = null;
    this.moviePool = []; // Cache for movie pool
  }

  async initialize() {
    if (!this.transformers) {
      this.transformers = await import("@xenova/transformers");
    }

    if (!this.model) {
      this.model = await this.transformers.pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }
  }

  async buildMoviePool() {
    try {
      console.log("🎬 Building expanded movie pool...");

      // Get multiple pages and genres for a larger pool
      const movieSources = await Promise.all([
        // Popular movies - multiple pages
        tmdbService.getPopularMovies(1),
        tmdbService.getPopularMovies(2),
        tmdbService.getPopularMovies(3),

        // Latest movies - multiple pages
        tmdbService.getLatestMovies(1),
        tmdbService.getLatestMovies(2),
        tmdbService.getLatestMovies(3),

        // Genre-based discovery - multiple pages per genre
        // Action movies
        tmdbService.discoverMovies({ genre: 28, page: 1 }),
        tmdbService.discoverMovies({ genre: 28, page: 2 }),
        tmdbService.discoverMovies({ genre: 28, page: 3 }),
        tmdbService.discoverMovies({ genre: 28, page: 4 }),
        tmdbService.discoverMovies({ genre: 28, page: 5 }),
        tmdbService.discoverMovies({ genre: 28, page: 6 }),

        // Comedy movies
        tmdbService.discoverMovies({ genre: 35, page: 1 }),
        tmdbService.discoverMovies({ genre: 35, page: 2 }),
        tmdbService.discoverMovies({ genre: 35, page: 3 }),
        tmdbService.discoverMovies({ genre: 35, page: 4 }),
        tmdbService.discoverMovies({ genre: 35, page: 5 }),

        // Drama movies
        tmdbService.discoverMovies({ genre: 18, page: 1 }),
        tmdbService.discoverMovies({ genre: 18, page: 2 }),
        tmdbService.discoverMovies({ genre: 18, page: 3 }),

        // Sci-Fi movies
        tmdbService.discoverMovies({ genre: 878, page: 1 }),
        tmdbService.discoverMovies({ genre: 878, page: 2 }),
        tmdbService.discoverMovies({ genre: 878, page: 3 }),
        tmdbService.discoverMovies({ genre: 878, page: 4 }),
        tmdbService.discoverMovies({ genre: 878, page: 5 }),
        tmdbService.discoverMovies({ genre: 878, page: 6 }),

        // Horror movies
        tmdbService.discoverMovies({ genre: 27, page: 1 }),
        tmdbService.discoverMovies({ genre: 27, page: 2 }),
        tmdbService.discoverMovies({ genre: 27, page: 3 }),

        // Romance movies
        tmdbService.discoverMovies({ genre: 10749, page: 1 }),
        tmdbService.discoverMovies({ genre: 10749, page: 2 }),
        tmdbService.discoverMovies({ genre: 10749, page: 3 }),
        tmdbService.discoverMovies({ genre: 10749, page: 4 }),
        tmdbService.discoverMovies({ genre: 10749, page: 5 }),
        tmdbService.discoverMovies({ genre: 10749, page: 6 }),

        // Thriller movies
        tmdbService.discoverMovies({ genre: 53, page: 1 }),
        tmdbService.discoverMovies({ genre: 53, page: 2 }),
        tmdbService.discoverMovies({ genre: 53, page: 3 }),
        tmdbService.discoverMovies({ genre: 53, page: 4 }),
        tmdbService.discoverMovies({ genre: 53, page: 5 }),
        tmdbService.discoverMovies({ genre: 53, page: 6 }),

        // Adventure movies
        tmdbService.discoverMovies({ genre: 12, page: 1 }),
        tmdbService.discoverMovies({ genre: 12, page: 2 }),
        tmdbService.discoverMovies({ genre: 12, page: 3 }),
        tmdbService.discoverMovies({ genre: 12, page: 4 }),
        tmdbService.discoverMovies({ genre: 12, page: 5 }),
        tmdbService.discoverMovies({ genre: 12, page: 6 }),

        // Animation movies
        tmdbService.discoverMovies({ genre: 16, page: 1 }),
        tmdbService.discoverMovies({ genre: 16, page: 2 }),

        // Crime movies
        tmdbService.discoverMovies({ genre: 80, page: 1 }),
        tmdbService.discoverMovies({ genre: 80, page: 2 }),
        tmdbService.discoverMovies({ genre: 80, page: 3 }),
        tmdbService.discoverMovies({ genre: 80, page: 4 }),
        tmdbService.discoverMovies({ genre: 80, page: 5 }),
        tmdbService.discoverMovies({ genre: 80, page: 6 }),

        // Fantasy movies
        tmdbService.discoverMovies({ genre: 14, page: 1 }),
        tmdbService.discoverMovies({ genre: 14, page: 2 }),
        tmdbService.discoverMovies({ genre: 14, page: 3 }),
        tmdbService.discoverMovies({ genre: 14, page: 4 }),

        // Mystery movies
        tmdbService.discoverMovies({ genre: 9648, page: 1 }),
        tmdbService.discoverMovies({ genre: 9648, page: 2 }),

        // Top rated movies from different years
        tmdbService.discoverMovies({ minRating: 7.5, page: 1 }),
        tmdbService.discoverMovies({ minRating: 7.5, page: 2 }),
        tmdbService.discoverMovies({ minRating: 7.5, page: 3 }),
        tmdbService.discoverMovies({ minRating: 7.5, page: 4 }),
        tmdbService.discoverMovies({ minRating: 7.5, page: 5 }),
        tmdbService.discoverMovies({ minRating: 7.5, page: 6 }),

        // Movies from different decades
        tmdbService.discoverMovies({ year: 2023, page: 1 }),
        tmdbService.discoverMovies({ year: 2022, page: 1 }),
        tmdbService.discoverMovies({ year: 2021, page: 1 }),
        tmdbService.discoverMovies({ year: 2020, page: 1 }),
        tmdbService.discoverMovies({ year: 2019, page: 1 }),
        tmdbService.discoverMovies({ year: 2018, page: 1 }),
      ]);

      // Combine all movies and remove duplicates
      const allMovies = [];
      const seenIds = new Set();

      movieSources.forEach((source) => {
        if (source && source.results) {
          source.results.forEach((movie) => {
            if (!seenIds.has(movie.tmdbId)) {
              seenIds.add(movie.tmdbId);
              allMovies.push(movie);
            }
          });
        }
      });

      console.log(`✅ Built movie pool with ${allMovies.length} movies`);
      return allMovies;
    } catch (error) {
      console.error("❌ Error building movie pool:", error);
      // Fallback to just popular movies
      const fallback = await tmdbService.getPopularMovies();
      return fallback.results || [];
    }
  }

  async getSuggestions(prompt) {
    try {
      await this.initialize();

      console.log(`🎬 Processing suggestion for: "${prompt}"`);

      // 1. Build expanded movie pool
      const moviePool = await this.buildMoviePool();

      if (moviePool.length === 0) {
        throw new Error("No movies available in the pool");
      }

      console.log(`📚 Using ${moviePool.length} movies for suggestions`);

      // 2. Filter out movies without overviews
      const moviesWithOverviews = moviePool.filter(
        (movie) => movie.overview && movie.overview.trim().length > 0
      );

      console.log(`📝 ${moviesWithOverviews.length} movies have overviews`);

      const movieOverviews = moviesWithOverviews.map((movie) => movie.overview);

      // 3. Create embeddings
      const promptEmbedding = await this.model(prompt, {
        pooling: "mean",
        normalize: true,
      });

      const movieEmbeddings = await this.model(movieOverviews, {
        pooling: "mean",
        normalize: true,
      });

      // 4. Calculate similarity scores
      const scores = [];
      for (let i = 0; i < movieEmbeddings.length; i++) {
        const score = this.transformers.cos_sim(
          promptEmbedding.data,
          movieEmbeddings[i].data
        );
        scores.push({
          movie: moviesWithOverviews[i],
          score: score,
          title: moviesWithOverviews[i].title,
        });
      }

      // 5. Sort by score (highest first)
      scores.sort((a, b) => b.score - a.score);

      // 6. Log top scores for debugging
      console.log("🏆 Top 5 similarity scores:");
      scores.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.title}: ${item.score.toFixed(4)}`);
      });

      // 7. Return top movies (lower threshold to ensure results)
      const minScore = 0.05; // Lower threshold to get more results
      const topMovies = scores
        .filter((s) => s.score > minScore)
        .slice(0, 8) // Get more movies initially
        .map((s) => s.movie);

      // 8. Fallback: if still no results, return highest scoring movies regardless of threshold
      if (topMovies.length === 0) {
        console.log(
          "⚠️ No movies above threshold, returning top scored movies"
        );
        const fallbackMovies = scores.slice(0, 5).map((s) => s.movie);
        console.log(
          `✅ Returning ${fallbackMovies.length} fallback suggestions`
        );
        return fallbackMovies;
      }

      console.log(
        `✅ Found ${topMovies.length} movie suggestions above threshold`
      );
      return topMovies.slice(0, 5); // Return top 5
    } catch (error) {
      console.error("❌ Error in getSuggestions:", error);

      // Ultimate fallback: return some popular movies
      try {
        console.log("🔄 Using fallback popular movies");
        const popularMovies = await tmdbService.getPopularMovies();
        const fallbackSuggestions = popularMovies.results.slice(0, 5);
        console.log(
          `✅ Returning ${fallbackSuggestions.length} fallback suggestions`
        );
        return fallbackSuggestions;
      } catch (fallbackError) {
        console.error("❌ Even fallback failed:", fallbackError);
        throw new Error("Failed to get any movie suggestions");
      }
    }
  }
}

module.exports = new SuggestionService();
