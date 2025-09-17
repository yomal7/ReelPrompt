import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut, Menu, X, Film, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900/98 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-500 rounded-lg p-2">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ReelPrompt</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a movie, tv show, person..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-slate-600/50 rounded-full focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-slate-300 transition-all duration-200"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button className="p-2 text-slate-300 hover:text-white transition-colors">
                <Plus className="h-5 w-5" />
              </button>
              <div className="px-3 py-1 border border-slate-600 rounded text-slate-300 text-sm">
                EN
              </div>
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  to="/suggestions"
                  className="flex items-center space-x-1 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  <Film className="h-4 w-4" />
                  <span>AI Suggestions</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  <User className="h-4 w-4" />
                  <span>{user?.name || user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  className="block px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-colors"
                >
                  Join ReelPrompt
                </Link>
              </>
            )}
          </div>
                  className="block px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium text-center transition-colors"
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a movie, tv show, person..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-slate-600/50 rounded-full focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-slate-300"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/suggestions"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>AI Suggestions</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 btn-primary text-white rounded-lg font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;