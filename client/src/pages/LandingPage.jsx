import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronDown,
  Clock,
  Filter,
  Play,
  Search,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";

const LandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    minRating: "",
  });

  const searchQuery = searchParams.get("search");

  // Fetch movies based on active tab and search
  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["movies", activeTab, searchQuery, filters],
    queryFn: async () => {
      if (searchQuery) {
        const { data } = await axios.get(
          `/api/movies/search?query=${searchQuery}`
        );
        return data;
      }

      if (activeTab === "discover") {
        const params = new URLSearchParams();
        if (filters.genre) params.append("genre", filters.genre);
        if (filters.year) params.append("year", filters.year);
        if (filters.minRating) params.append("minRating", filters.minRating);

        const { data } = await axios.get(`/api/movies/discover?${params}`);
        return data;
      }

      const endpoint =
        activeTab === "popular" ? "/api/movies/popular" : "/api/movies/latest";
      const { data } = await axios.get(endpoint);
      return data;
    },
    enabled: true,
  });

  // Fetch genres for filter
  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data } = await axios.get("/api/movies/genres");
      return data;
    },
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  const movies = moviesData?.data?.results || moviesData?.data || [];
  const genres = genresData?.data || [];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section - Improved */}
      <div className="relative overflow-hidden">
        {/* Background with better gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-pink-900/70"></div>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          {/* Hero Content - Better spacing and typography */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Discover Your Next
                <span className="gradient-text block mt-2">Favorite Movie</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore thousands of movies with AI-powered recommendations.
                Never run out of great content to watch.
              </p>
            </div>

            {/* Hero Stats - Added for credibility */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <span>Thousands of movies</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-indigo-400" />
                <span>AI-powered suggestions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4 text-pink-400" />
                <span>Instant recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results Header - Improved styling */}
        {searchQuery && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Search className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">Search Results</h2>
                    <p className="text-gray-400 text-sm">
                      Showing results for{" "}
                      <span className="text-indigo-400 font-medium">
                        "{searchQuery}"
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs and Filters - Improved design */}
        {!searchQuery && (
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Tabs - Better styling */}
              <div className="flex flex-col sm:flex-row gap-4">
                <h2 className="text-2xl font-bold text-white self-start sm:self-center">
                  Browse Movies
                </h2>
                <div className="flex space-x-1 bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-xl border border-gray-700/50">
                  {[
                    { id: "popular", label: "Popular", icon: TrendingUp },
                    { id: "latest", label: "Latest", icon: Clock },
                    { id: "discover", label: "Discover", icon: Filter },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === id
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Toggle - Better positioning */}
              {activeTab === "discover" && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-300 rounded-xl hover:text-white hover:bg-gray-700/80 transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                  <span>Advanced Filters</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Filters Panel - Enhanced styling */}
            {activeTab === "discover" && showFilters && (
              <div className="mt-6 animate-fade-in">
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Filter Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Genre
                      </label>
                      <select
                        value={filters.genre}
                        onChange={(e) =>
                          handleFilterChange("genre", e.target.value)
                        }
                        className="w-full px-3 py-2.5 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm"
                      >
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Release Year
                      </label>
                      <select
                        value={filters.year}
                        onChange={(e) =>
                          handleFilterChange("year", e.target.value)
                        }
                        className="w-full px-3 py-2.5 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm"
                      >
                        <option value="">All Years</option>
                        {Array.from(
                          { length: 30 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Minimum Rating
                      </label>
                      <select
                        value={filters.minRating}
                        onChange={(e) =>
                          handleFilterChange("minRating", e.target.value)
                        }
                        className="w-full px-3 py-2.5 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm"
                      >
                        <option value="">Any Rating</option>
                        <option value="7">7.0+ ⭐</option>
                        <option value="8">8.0+ ⭐⭐</option>
                        <option value="9">9.0+ ⭐⭐⭐</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Movies Grid */}
        <div className="animate-fade-in">
          <MovieGrid
            movies={movies}
            loading={isLoading}
            emptyMessage={
              searchQuery
                ? "No movies found for your search"
                : "No movies available"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
