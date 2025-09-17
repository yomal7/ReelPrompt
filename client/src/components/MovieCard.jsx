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
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
        {/* Image Container - Fixed aspect ratio */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x600/374151/9CA3AF?text=No+Image";
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30 hover:bg-white/30 transition-colors">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>

          {/* Rating badge */}
          {rating > 0 && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-1">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-semibold">
                  {formattedRating}
                </span>
              </div>
            </div>
          )}

          {/* Favorite button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/80 transition-all duration-200 group/fav"
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
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200">
            {movie.title}
          </h3>

          {/* Meta info */}
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{releaseYear}</span>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-xs font-medium border border-indigo-500/30">
                {Array.isArray(movie.genres)
                  ? movie.genres[0]?.name || movie.genres[0]
                  : movie.genres}
              </span>
            )}
          </div>

          {/* Overview */}
          {movie.overview && (
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
