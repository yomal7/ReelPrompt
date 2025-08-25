import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  User, 
  Heart, 
  Star, 
  MessageCircle, 
  Edit3,
  Mail,
  Calendar,
  TrendingUp
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');

  // Fetch user stats
  const { data: statsData } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users/stats');
      return data;
    }
  });

  // Fetch user favorites
  const { data: favoritesData, isLoading: favoritesLoading } = useQuery({
    queryKey: ['user-favorites'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users/favorites');
      return data;
    },
    enabled: activeTab === 'favorites'
  });

  // Fetch user ratings
  const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
    queryKey: ['user-ratings'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users/ratings');
      return data;
    },
    enabled: activeTab === 'ratings'
  });

  // Fetch user comments
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['user-comments'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users/comments');
      return data;
    },
    enabled: activeTab === 'comments'
  });

  const stats = statsData?.data || {};
  const favorites = favoritesData?.data?.favorites || [];
  const ratings = ratingsData?.data?.ratings || [];
  const comments = commentsData?.data?.comments || [];

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Heart, count: stats.favoritesCount },
    { id: 'ratings', label: 'Ratings', icon: Star, count: stats.ratingsCount },
    { id: 'comments', label: 'Comments', icon: MessageCircle, count: stats.commentsCount }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {user?.name || user?.username}
                </h1>
                <div className="flex items-center space-x-4 text-gray-400 mt-2">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.favoritesCount || 0}</div>
              <div className="text-gray-400 text-sm">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.ratingsCount || 0}</div>
              <div className="text-gray-400 text-sm">Ratings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.commentsCount || 0}</div>
              <div className="text-gray-400 text-sm">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.averageRating || '0.0'}</div>
              <div className="text-gray-400 text-sm">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500" />
                <span>Favorite Movies</span>
              </h2>
              <MovieGrid
                movies={favorites.map(fav => fav.movie)}
                loading={favoritesLoading}
                emptyMessage="You haven't added any movies to your favorites yet."
              />
            </div>
          )}

          {activeTab === 'ratings' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Star className="h-6 w-6 text-yellow-400" />
                <span>Your Ratings</span>
              </h2>
              {ratingsLoading ? (
                <LoadingSpinner size="xl" className="py-20" />
              ) : ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                      <img
                        src={rating.movie.posterUrl}
                        alt={rating.movie.title}
                        className="w-16 h-24 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x96/374151/9CA3AF?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{rating.movie.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= rating.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm">
                            Rated on {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">You haven't rated any movies yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <MessageCircle className="h-6 w-6 text-blue-400" />
                <span>Your Comments</span>
              </h2>
              {commentsLoading ? (
                <LoadingSpinner size="xl" className="py-20" />
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <img
                          src={comment.movie.posterUrl}
                          alt={comment.movie.title}
                          className="w-16 h-24 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x96/374151/9CA3AF?text=No+Image';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{comment.movie.title}</h3>
                          <p className="text-gray-300 mb-2">{comment.content}</p>
                          <div className="text-gray-400 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">You haven't commented on any movies yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;