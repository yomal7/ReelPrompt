import { Film, Search, Sparkles } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import MovieCard from "./MovieCard";

const SkeletonCard = () => (
  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
    <div className="aspect-[2/3] bg-gray-700/50 skeleton"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-700/50 rounded skeleton"></div>
      <div className="h-3 bg-gray-700/50 rounded w-3/4 skeleton"></div>
      <div className="h-3 bg-gray-700/50 rounded w-1/2 skeleton"></div>
    </div>
  </div>
);

const EmptyState = ({ message, icon: Icon = Film }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="relative mb-6">
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      <Sparkles className="h-6 w-6 text-indigo-400 absolute -top-1 -right-1 animate-pulse" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Movies Found</h3>
    <p className="text-gray-400 max-w-md leading-relaxed">{message}</p>
  </div>
);

const MovieGrid = ({
  movies = [],
  loading = false,
  showFavorites = false,
  onToggleFavorite,
  emptyMessage = "No movies found",
}) => {
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <LoadingSpinner size="xl" />
            <p className="text-gray-400 animate-pulse">
              Loading amazing movies...
            </p>
          </div>
        </div>

        {/* Loading skeleton grid */}
        <div className="movie-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    const icon = emptyMessage.toLowerCase().includes("search") ? Search : Film;
    return <EmptyState message={emptyMessage} icon={icon} />;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing{" "}
          <span className="text-white font-medium">{movies.length}</span> movies
        </p>
        {movies.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live results</span>
          </div>
        )}
      </div>

      {/* Movies grid */}
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <div
            key={movie.id || movie.tmdbId || index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <MovieCard
              movie={movie}
              showFavorite={showFavorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
