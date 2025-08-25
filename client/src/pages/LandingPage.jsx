import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Filter, ChevronDown, TrendingUp, Clock, Search } from 'lucide-react';

const LandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: ''
  });

  const searchQuery = searchParams.get('search');

  // Fetch movies based on active tab and search
  const { data: moviesData, isLoading } = useQuery({
    queryKey: ['movies', activeTab, searchQuery, filters],
    queryFn: async () => {
      if (searchQuery) {
        const { data } = await axios.get(`/api/movies/search?query=${searchQuery}`);
        return data;
      }

      if (activeTab === 'discover') {
        const params = new URLSearchParams();
        if (filters.genre) params.append('genre', filters.genre);
        if (filters.year) params.append('year', filters.year);
        if (filters.minRating) params.append('minRating', filters.minRating);
        
        const { data } = await axios.get(`/api/movies/discover?${params}`);
        return data;
      }

      const endpoint = activeTab === 'popular' ? '/api/movies/popular' : '/api/movies/latest';
      const { data } = await axios.get(endpoint);
      return data;
    },
    enabled: true
  });

  // Fetch genres for filter
  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data } = await axios.get('/api/movies/genres');
      return data;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  const movies = moviesData?.data?.results || moviesData?.data || [];
  const genres = genresData?.data || [];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Discover Your Next
            <span className="gradient-text block">Favorite Movie</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
            Explore thousands of movies, get AI-powered recommendations, and never run out of great content to watch.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-indigo-400" />
                <span className="text-white">
                  Search results for: <span className="text-indigo-400 font-semibold">"{searchQuery}"</span>
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Tabs and Filters */}
        {!searchQuery && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'popular'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Popular</span>
                </button>
                <button
                  onClick={() => setActiveTab('latest')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'latest'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>Latest</span>
                </button>
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'discover'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Discover</span>
                </button>
              </div>

              {/* Filter Toggle */}
              {activeTab === 'discover' && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Filters Panel */}
            {activeTab === 'discover' && showFilters && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Genre
                    </label>
                    <select
                      value={filters.genre}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">All Genres</option>
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <select
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">All Years</option>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Any Rating</option>
                      <option value="7">7.0+</option>
                      <option value="8">8.0+</option>
                      <option value="9">9.0+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Movies Grid */}
        <MovieGrid
          movies={movies}
          loading={isLoading}
          emptyMessage={searchQuery ? "No movies found for your search" : "No movies available"}
        />
      </div>
    </div>
  );
};

export default LandingPage;