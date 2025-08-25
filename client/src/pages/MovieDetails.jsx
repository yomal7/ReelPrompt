import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  MessageCircle, 
  Send,
  Play,
  Users,
  Globe
} from 'lucide-react';

const MovieDetails = () => {
  const { tmdbId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  // Fetch movie details
  const { data: movieData, isLoading } = useQuery({
    queryKey: ['movie', tmdbId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/movies/${tmdbId}`);
      return data;
    }
  });

  // Rate movie mutation
  const rateMutation = useMutation({
    mutationFn: async (rating) => {
      const { data } = await axios.post(`/api/movies/${tmdbId}/rate`, { rating });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['movie', tmdbId]);
    }
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content) => {
      const { data } = await axios.post(`/api/movies/${tmdbId}/comment`, { content });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['movie', tmdbId]);
      setComment('');
    }
  });

  // Toggle favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/movies/${tmdbId}/favorite`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['movie', tmdbId]);
    }
  });

  const handleRating = (rating) => {
    setUserRating(rating);
    rateMutation.mutate(rating);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate(comment.trim());
    }
  };

  const handleFavorite = () => {
    favoriteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!movieData?.success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <p className="text-gray-400">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const movie = movieData.data;
  const backdropUrl = movie.backdropUrl || `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const posterUrl = movie.posterUrl || `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Backdrop */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1920x1080/374151/9CA3AF?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        
        {/* Play Button */}
        {movie.videos && movie.videos.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors rounded-full p-6">
              <Play className="h-12 w-12 text-white ml-1" />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Image';
                }}
              />
              
              {/* User Actions */}
              {isAuthenticated && (
                <div className="mt-6 space-y-4">
                  {/* Rating */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">Rate this movie</h3>
                    <StarRating
                      rating={movie.userRating || userRating}
                      onRatingChange={handleRating}
                      size="lg"
                    />
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={handleFavorite}
                    disabled={favoriteMutation.isLoading}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                      movie.isFavorite
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${movie.isFavorite ? 'fill-current' : ''}`} />
                    <span>{movie.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Movie Info and Comments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Movie Info */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
              
              {/* Movie Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
                {movie.releaseDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                
                {movie.voteAverage && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>{movie.voteAverage.toFixed(1)}/10</span>
                  </div>
                )}

                {movie.language && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>{movie.language.toUpperCase()}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id || genre}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full"
                    >
                      {genre.name || genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                </div>
              )}

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Cast</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.cast.slice(0, 6).map((actor) => (
                      <div key={actor.id} className="text-center">
                        <div className="text-white font-medium">{actor.name}</div>
                        <div className="text-gray-400 text-sm">{actor.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Comments ({movie.comments?.length || 0})</span>
              </h3>

              {/* Add Comment Form */}
              {isAuthenticated && (
                <form onSubmit={handleComment} className="mb-6">
                  <div className="flex space-x-3">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this movie..."
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                      rows="3"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim() || commentMutation.isLoading}
                      className="px-4 py-2 btn-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {commentMutation.isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {movie.comments && movie.comments.length > 0 ? (
                  movie.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {comment.user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{comment.user.username}</div>
                          <div className="text-gray-400 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;