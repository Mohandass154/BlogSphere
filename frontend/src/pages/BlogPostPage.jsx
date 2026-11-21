import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import CommentSection from '../components/CommentSection';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Share2, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.get(`/posts/${id}`);
        if (isMounted) {
          if (data.success && data.post) {
            setPost(data.post);
          } else {
            setError(data.message || 'Blog post not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load blog post');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isOwner = user && post && post.author && user._id === post.author._id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const data = await api.delete(`/posts/${id}`);
      if (data.success) {
        navigate('/my-blogs', { state: { message: 'Post successfully deleted' } });
      }
    } catch (err) {
      alert(err.message || 'Failed to delete post');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="post-detail-loading">
        <div className="spinner" />
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-error">
        <h2>Post Not Found</h2>
        <p>{error || 'The blog post you requested does not exist or has been removed.'}</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const authorName = post.author?.name || 'Anonymous Author';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="blog-post-page">
      <div className="blog-post-container">
        {/* Top Navigation */}
        <div className="post-top-bar">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Back to All Blogs</span>
          </Link>

          <div className="post-top-actions">
            <button 
              onClick={handleShare} 
              className="btn btn-outline btn-sm share-btn"
              title="Copy link to clipboard"
            >
              {copied ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            {isOwner && (
              <div className="author-actions">
                <Link to={`/edit-blog/${post._id}`} className="btn btn-outline btn-sm edit-btn">
                  <Edit3 size={16} />
                  <span>Edit Post</span>
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn btn-danger btn-sm"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Header */}
        <header className="post-header">
          <span className="post-category-tag">{post.category || 'General'}</span>
          <h1 className="post-title">{post.title}</h1>

          {/* Author & Meta Bar */}
          <div className="post-meta-bar">
            <div className="post-author-box">
              <div className="post-author-avatar">{authorInitial}</div>
              <div>
                <div className="post-author-name">{authorName}</div>
                {post.author?.bio && (
                  <div className="post-author-bio-snippet">{post.author.bio}</div>
                )}
              </div>
            </div>

            <div className="post-date-read-box">
              <span className="meta-item">
                <Calendar size={15} />
                <span>{formattedDate}</span>
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-item">
                <Clock size={15} />
                <span>{readTime} min read</span>
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="post-cover-image-wrap">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="post-cover-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          </div>
        )}

        {/* Post Body Content */}
        <article className="post-content">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="post-subheading">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="post-subheading-2">{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('# ')) {
              return <h1 key={index} className="post-subheading-1">{paragraph.replace('# ', '')}</h1>;
            }
            return <p key={index} className="post-paragraph">{paragraph}</p>;
          })}
        </article>

        {/* Author Bio Card at Footer */}
        <div className="author-card">
          <div className="author-card-avatar">{authorInitial}</div>
          <div className="author-card-info">
            <h4 className="author-card-title">Written by {authorName}</h4>
            <p className="author-card-bio">
              {post.author?.bio || 'Passionate writer sharing insights on modern tech, architecture, and design on BlogSphere.'}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post._id} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-icon text-danger">
              <AlertTriangle size={36} />
            </div>
            <h3 className="modal-title">Delete this blog post?</h3>
            <p className="modal-desc">
              Are you sure you want to delete "<strong>{post.title}</strong>"? This action cannot be undone and will permanently remove this post and all associated comments.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeletePost}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
