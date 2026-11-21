import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import BlogCard from '../components/BlogCard';
import { Search, Sparkles, SlidersHorizontal, BookOpen, PenSquare, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Technology', 'Backend', 'Design', 'Productivity', 'General'];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'All';
    const searchFromUrl = searchParams.get('search') || '';
    setSelectedCategory(categoryFromUrl);
    setSearchTerm(searchFromUrl);
    setActiveSearch(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (activeSearch && activeSearch.trim() !== '') {
          params.append('search', activeSearch.trim());
        }

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const data = await api.get(`/posts${queryString}`);

        if (isMounted) {
          if (data.success) {
            setPosts(data.posts || []);
          } else {
            setError(data.message || 'Failed to fetch posts');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to connect to the server');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
    updateUrlParams(selectedCategory, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearch('');
    updateUrlParams(selectedCategory, '');
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    updateUrlParams(cat, activeSearch);
  };

  const updateUrlParams = (cat, search) => {
    const newParams = new URLSearchParams();
    if (cat && cat !== 'All') newParams.set('category', cat);
    if (search && search.trim() !== '') newParams.set('search', search.trim());
    setSearchParams(newParams);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Modern Blogging Redefined</span>
          </div>
          <h1 className="hero-title">
            Where Ideas, Stories & <span className="text-gradient">Innovations</span> Connect
          </h1>
          <p className="hero-subtitle">
            Welcome to BlogSphere. Discover deep-dive engineering tutorials, design perspectives, and inspiring narratives written by creators around the world.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/create-blog" className="btn btn-primary btn-lg">
                <PenSquare size={18} />
                <span>Write a Story</span>
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Start Writing for Free</span>
              </Link>
            )}
            <a href="#explore" className="btn btn-outline btn-lg">
              <BookOpen size={18} />
              <span>Explore Articles</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="content-container" id="explore">
        {/* Search & Filter Toolbar */}
        <div className="toolbar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search blogs by title, keywords or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary search-submit-btn">
              Search
            </button>
          </form>

          {/* Category Pills */}
          <div className="category-scroll">
            <div className="category-chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="alert-banner error">
            <p>{error}</p>
          </div>
        )}

        {/* Active Filters Display */}
        {(selectedCategory !== 'All' || activeSearch) && (
          <div className="active-filters">
            <span className="active-filters-label">Filters applied:</span>
            {selectedCategory !== 'All' && (
              <span className="filter-tag">
                Category: {selectedCategory}
                <button onClick={() => handleSelectCategory('All')}>&times;</button>
              </span>
            )}
            {activeSearch && (
              <span className="filter-tag">
                Query: "{activeSearch}"
                <button onClick={handleClearSearch}>&times;</button>
              </span>
            )}
            <button
              onClick={() => {
                handleSelectCategory('All');
                handleClearSearch();
              }}
              className="btn-clear-all"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="posts-loading-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-meta" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No blogs found</h3>
            <p className="empty-state-desc">
              {activeSearch || selectedCategory !== 'All'
                ? "We couldn't find any articles matching your search criteria. Try using different keywords or resetting filters."
                : 'No blog posts have been published yet. Be the first to share your insights!'}
            </p>
            {activeSearch || selectedCategory !== 'All' ? (
              <button
                onClick={() => {
                  handleSelectCategory('All');
                  handleClearSearch();
                }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
            ) : isAuthenticated ? (
              <Link to="/create-blog" className="btn btn-primary">
                Create First Blog
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
