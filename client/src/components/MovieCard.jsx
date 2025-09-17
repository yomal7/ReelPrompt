import { Calendar, Heart, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie, showFavorite = false, onToggleFavorite }) => {
  const posterUrl =
    movie.posterUrl || `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const releaseYear =
    movie.releaseDate || movie.release_date
      ? new Date(movie.releaseDate || movie.release_date).getFullYear()
      : "N/A";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  const rating = movie.voteAverage || movie.vote_average || 0;
  const formattedRating =
    typeof rating === "number" ? rating.toFixed(1) : "0.0";

  return (
    <Link to={`/movie/${movie.tmdbId || movie.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:scale-105">
        {/* Image Container - Fixed aspect ratio */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x600/e2e8f0/64748b?text=No+Image";
            }}
          />

          {/* Rating badge */}
          {rating > 0 && (
            <div className="absolute bottom-2 left-2">
              <div className="bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center relative">
                    <span className="text-white text-xs font-bold">
                      {Math.round(rating * 10)}
                    </span>
                    <div className="absolute inset-0 rounded-full" style={{
                      background: `conic-gradient(#06b6d4 ${rating * 36}deg, transparent ${rating * 36}deg)`
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Favorite button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-2 bg-slate-900/70 backdrop-blur-sm rounded-full hover:bg-slate-900/90 transition-all duration-200 group/fav"
            >
              <Heart
                className={`h-4 w-4 transition-transform duration-200 group-hover/fav:scale-110 ${
                  movie.isFavorite
                    ? "text-red-500 fill-current"
                    : "text-white hover:text-red-400"
                }`}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Title */}
          <h3 className="text-slate-900 font-semibold text-base leading-tight line-clamp-2 group-hover:text-cyan-600 transition-colors duration-200">
            {movie.title}
          </h3>

          {/* Meta info */}
          <div className="text-slate-600 text-sm">
            <span>{releaseYear}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
