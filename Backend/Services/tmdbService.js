// services/tmdbService.js
const axios = require("axios");

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.accessToken = process.env.TMDB_ACCESS_TOKEN;
    this.baseURL = "https://api.themoviedb.org/3";
    this.imageBaseURL = "https://image.tmdb.org/t/p";

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }

  // Helper method to get full image URLs
  getImageURL(path, size = "w500") {
    if (!path) return null;
    return `${this.imageBaseURL}/${size}${path}`;
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    try {
      const response = await this.api.get("/movie/popular", {
        params: { page, language: "en-US" },
      });

      return {
        ...response.data,
        results: response.data.results.map((movie) => this.formatMovie(movie)),
      };
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw new Error("Failed to fetch popular movies");
    }
  }

  // Get latest movies
  async getLatestMovies(page = 1) {
    try {
      const response = await this.api.get("/movie/now_playing", {
        params: { page, language: "en-US" },
      });

      return {
        ...response.data,
        results: response.data.results.map((movie) => this.formatMovie(movie)),
      };
    } catch (error) {
      console.error("Error fetching latest movies:", error);
      throw new Error("Failed to fetch latest movies");
    }
  }

  // Search movies
  async searchMovies(query, page = 1) {
    try {
      const response = await this.api.get("/search/movie", {
        params: {
          query,
          page,
          language: "en-US",
          include_adult: false,
        },
      });

      return {
        ...response.data,
        results: response.data.results.map((movie) => this.formatMovie(movie)),
      };
    } catch (error) {
      console.error("Error searching movies:", error);
      throw new Error("Failed to search movies");
    }
  }

  // Get movie details
  async getMovieDetails(movieId) {
    try {
      const response = await this.api.get(`/movie/${movieId}`, {
        params: {
          language: "en-US",
          append_to_response: "credits,videos,reviews",
        },
      });

      return this.formatMovieDetails(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw new Error("Failed to fetch movie details");
    }
  }

  // Discover movies with filters
  async discoverMovies(filters = {}, page = 1) {
    try {
      const params = {
        page,
        language: "en-US",
        sort_by: filters.sortBy || "popularity.desc",
        ...filters,
      };

      const response = await this.api.get("/discover/movie", { params });

      return {
        ...response.data,
        results: response.data.results.map((movie) => this.formatMovie(movie)),
      };
    } catch (error) {
      console.error("Error discovering movies:", error);
      throw new Error("Failed to discover movies");
    }
  }

  // Get movie genres
  async getGenres() {
    try {
      const response = await this.api.get("/genre/movie/list", {
        params: { language: "en-US" },
      });

      return response.data.genres;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw new Error("Failed to fetch genres");
    }
  }

  // Format movie data
  formatMovie(movie) {
    return {
      tmdbId: movie.id,
      title: movie.title,
      posterUrl: this.getImageURL(movie.poster_path),
      backdropUrl: this.getImageURL(movie.backdrop_path, "w1280"),
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genre_ids || [],
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      adult: movie.adult,
      language: movie.original_language,
    };
  }

  // Format detailed movie data
  formatMovieDetails(movie) {
    return {
      tmdbId: movie.id,
      title: movie.title,
      posterUrl: this.getImageURL(movie.poster_path),
      backdropUrl: this.getImageURL(movie.backdrop_path, "w1280"),
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genres || [],
      runtime: movie.runtime,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      adult: movie.adult,
      language: movie.original_language,
      cast: movie.credits?.cast?.slice(0, 10) || [],
      crew: movie.credits?.crew || [],
      videos: movie.videos?.results || [],
      reviews: movie.reviews?.results || [],
    };
  }
}

module.exports = new TMDBService();
