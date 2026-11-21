import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  PenSquare, 
  Layers, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

const MyBlogsPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.get('/posts/user/me');
        if (isMounted) {
          if (data.success) {
            setPosts(data.posts || []);
          } else {
            setError(data.message || 'Failed to load your posts');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error connecting to the server');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMyPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      setIsDeleting(true);
      const data = await api.delete(`/posts/${postToDelete._id}`);
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
        setSuccessMessage('Blog post deleted successfully.');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="my-blogs-page">
      <div className="content-container">
        {/* Header Bar */}
        <div className="page-header-row">
          <div>
            <div className="header-subtitle-tag">Dashboard</div>
            <h1 className="page-heading">My Blogs</h1>
            <p className="page-subheading">
              Manage your published articles, monitor engagements, or draft new stories.
            </p>
          </div>

          <Link to="/create-blog" className="btn btn-primary">
            <PenSquare size={16} />
            <span>Create New Blog</span>
          </Link>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="alert-banner success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert-banner error">
            <p>{error}</p>
          </div>
        )}

        {/* User Stats Card */}
        <div className="my-blogs-stats-banner">
          <div className="stat-item">
            <span className="stat-label">Author</span>
            <span className="stat-value">{user?.name}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Published Articles</span>
            <span className="stat-value">{posts.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Email</span>
            <span className="stat-value-sm">{user?.email}</span>
          </div>
        </div>

        {/* Posts Content */}
        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p>Loading your articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <Layers size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No blogs published yet</h3>
            <p className="empty-state-desc">
              You haven't written any stories yet. Share your knowledge or thoughts with the community today!
            </p>
            <Link to="/create-blog" className="btn btn-primary">
              <PenSquare size={16} />
              <span>Write Your First Blog</span>
            </Link>
          </div>
        ) : (
          <div className="my-blogs-table-wrap">
            <div className="my-blogs-list">
              {posts.map((post) => {
                const formattedDate = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : '';
                const words = post.content ? post.content.split(/\s+/).length : 0;
                const readTime = Math.max(1, Math.ceil(words / 200));

                return (
                  <div key={post._id} className="my-blog-item">
                    <div className="my-blog-info">
                      <div className="my-blog-meta-top">
                        <span className="card-category-badge">{post.category || 'General'}</span>
                        <span className="meta-item">
                          <Calendar size={13} />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="meta-separator">•</span>
                        <span className="meta-item">
                          <Clock size={13} />
                          <span>{readTime} min read</span>
                        </span>
                      </div>

                      <h3 className="my-blog-title">
                        <Link to={`/posts/${post._id}`}>{post.title}</Link>
                      </h3>

                      <p className="my-blog-excerpt">
                        {post.excerpt || post.content.slice(0, 140) + '...'}
                      </p>
                    </div>

                    <div className="my-blog-actions">
                      <Link 
                        to={`/posts/${post._id}`} 
                        className="btn btn-outline btn-sm action-btn" 
                        title="View published post"
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </Link>

                      <Link 
                        to={`/edit-blog/${post._id}`} 
                        className="btn btn-outline btn-sm action-btn" 
                        title="Edit post"
                      >
                        <Edit3 size={15} />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setPostToDelete(post)}
                        className="btn btn-danger btn-sm action-btn"
                        title="Delete post"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-icon text-danger">
              <AlertTriangle size={36} />
            </div>
            <h3 className="modal-title">Delete this blog post?</h3>
            <p className="modal-desc">
              Are you sure you want to delete "<strong>{postToDelete.title}</strong>"? All comments on this post will also be permanently deleted.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setPostToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
