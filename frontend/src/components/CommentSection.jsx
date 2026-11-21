import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { MessageSquare, Send, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Fetch comments
  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/posts/${postId}/comments`);
        if (isMounted && data.success) {
          setComments(data.comments || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load comments:', err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const data = await api.post(`/posts/${postId}/comments`, {
        content: newComment.trim()
      });

      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment('');
        setSuccess('Comment posted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setDeletingId(commentId);
      const data = await api.delete(`/comments/${commentId}`);
      if (data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="comments-section" id="comments">
      <div className="comments-header">
        <div className="comments-title-wrap">
          <MessageSquare size={22} className="text-primary" />
          <h3 className="comments-heading">
            Comments <span className="comments-count">({comments.length})</span>
          </h3>
        </div>
      </div>

      {/* Add Comment Form or Login Banner */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="comment-form">
          <div className="comment-form-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="comment-form-body">
            <textarea
              className="comment-textarea"
              rows={3}
              placeholder={`Write a thoughtful comment as ${user?.name}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
              required
            />
            
            {error && (
              <div className="inline-alert error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="inline-alert success">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="comment-form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submitting || !newComment.trim()}
              >
                <Send size={14} />
                <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="comment-login-banner">
          <p className="login-banner-text">
            Join the discussion! You must be logged in to leave a comment.
          </p>
          <div className="login-banner-buttons">
            <Link to="/login" className="btn btn-primary btn-sm">
              Log in to Comment
            </Link>
            <Link to="/register" className="btn btn-outline btn-sm">
              Create an Account
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">
            <div className="spinner-small" />
            <span>Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <MessageSquare size={36} className="text-muted" />
            <p>No comments yet. Be the first to start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const authorName = comment.author?.name || 'Community Member';
            const authorInitial = authorName.charAt(0).toUpperCase();
            const isOwner = user && comment.author && user._id === comment.author._id;

            return (
              <div key={comment._id} className="comment-item">
                <div className="comment-avatar">{authorInitial}</div>
                <div className="comment-content">
                  <div className="comment-meta">
                    <span className="comment-author-name">{authorName}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    {isOwner && <span className="author-pill">You</span>}
                  </div>

                  <p className="comment-text">{comment.content}</p>

                  {isOwner && (
                    <div className="comment-actions">
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deletingId === comment._id}
                        className="btn-delete-comment"
                        title="Delete comment"
                      >
                        <Trash2 size={14} />
                        <span>{deletingId === comment._id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default CommentSection;
