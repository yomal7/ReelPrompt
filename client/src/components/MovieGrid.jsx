import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

const MovieGrid = ({ 
  movies = [], 
  loading = false, 
  showFavorites = false, 
  onToggleFavorite,
  emptyMessage = "No movies found"
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 text-lg">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="movie-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id || movie.tmdbId}
          movie={movie}
          showFavorite={showFavorites}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default MovieGrid;