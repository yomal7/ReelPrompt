import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, Send, Lightbulb, Film, Zap } from 'lucide-react';

const Suggestions = () => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const suggestionMutation = useMutation({
    mutationFn: async (promptText) => {
      const { data } = await axios.post('/api/suggestions', { prompt: promptText });
      return data;
    },
    onSuccess: (data) => {
      setSuggestions(data.data || []);
      setHasSearched(true);
    },
    onError: (error) => {
      console.error('Suggestion error:', error);
      setSuggestions([]);
      setHasSearched(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      suggestionMutation.mutate(prompt.trim());
    }
  };

  const examplePrompts = [
    "I want to watch a sci-fi movie with time travel and action",
    "Funny romantic comedies from the 90s",
    "Dark psychological thrillers with plot twists",
    "Feel-good animated movies for family night",
    "Epic fantasy adventures with magic and dragons",
    "Intense war movies based on true stories"
  ];

  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-indigo-500" />
              <Zap className="h-6 w-6 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              AI Movie Suggestions
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Describe what you're in the mood for, and our AI will find the perfect movies for you
          </p>
        </div>

        {/* Suggestion Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the kind of movie you want to watch... (e.g., 'I want a funny movie with superheroes' or 'Something scary but not too gory')"
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 resize-none text-lg"
                rows="4"
                disabled={suggestionMutation.isLoading}
              />
              <div className="absolute bottom-4 right-4">
                <button
                  type="submit"
                  disabled={!prompt.trim() || suggestionMutation.isLoading}
                  className="btn-primary px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-white"
                >
                  {suggestionMutation.isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Get Suggestions</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Example Prompts */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300 font-medium">Try these examples:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 rounded-lg transition-colors text-gray-300 hover:text-white"
                  disabled={suggestionMutation.isLoading}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {suggestionMutation.isLoading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center space-x-3 bg-gray-800 px-8 py-4 rounded-lg">
              <LoadingSpinner size="md" />
              <span className="text-white text-lg">Finding perfect movies for you...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {suggestionMutation.isError && (
          <div className="text-center py-20">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-medium">Oops! Something went wrong</p>
              <p className="text-sm mt-1">
                {suggestionMutation.error?.response?.data?.error || 'Failed to get suggestions. Please try again.'}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && !suggestionMutation.isLoading && (
          <div>
            {suggestions.length > 0 ? (
              <div>
                <div className="flex items-center space-x-3 mb-8">
                  <Film className="h-6 w-6 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Here are your personalized movie suggestions:
                  </h2>
                </div>
                <MovieGrid
                  movies={suggestions}
                  emptyMessage="No suggestions found. Try a different prompt!"
                />
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                  <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                  <p className="text-gray-400">
                    Try being more specific or use different keywords in your prompt.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && !suggestionMutation.isLoading && (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-8 border border-indigo-500/30">
                <Sparkles className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to discover your next favorite movie?
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Our AI analyzes thousands of movies to find the perfect matches for your mood. 
                  Just describe what you're looking for, and we'll do the rest!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;