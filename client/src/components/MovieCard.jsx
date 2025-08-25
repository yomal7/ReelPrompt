import { Link } from 'react-router-dom';
import { Star, Calendar, Heart } from 'lucide-react';

const MovieCard = ({ movie, showFavorite = false, onToggleFavorite }) => {
  const posterUrl = movie.posterUrl || `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const releaseYear = movie.releaseDate || movie.release_date 
    ? new Date(movie.releaseDate || movie.release_date).getFullYear() 
    : 'N/A';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  return (
    <Link to={`/movie/${movie.tmdbId || movie.id}`} className="block">
      <div className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
        <div className="relative">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Image';
            }}
          />
          
          {/* Favorite button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <Heart 
                className={`h-5 w-5 ${movie.isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} 
              />
            </button>
          )}

          {/* Rating overlay */}
          {movie.voteAverage && (
            <div className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded-lg flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">
                {typeof movie.voteAverage === 'number' 
                  ? movie.voteAverage.toFixed(1) 
                  : movie.vote_average?.toFixed(1) || 'N/A'}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{releaseYear}</span>
            </div>
            
            {movie.genres && movie.genres.length > 0 && (
              <span className="text-indigo-400 font-medium">
                {Array.isArray(movie.genres) 
                  ? movie.genres[0]?.name || movie.genres[0]
                  : movie.genres}
              </span>
            )}
          </div>

          {movie.overview && (
            <p className="text-gray-400 text-sm mt-2 line-clamp-3">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;