import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { PenSquare, Image, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

const POPULAR_CATEGORIES = ['Technology', 'Backend', 'Design', 'Productivity', 'Lifestyle', 'General'];

const CreateBlogPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    coverImage: '',
    excerpt: '',
    content: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'coverImage') {
      setImagePreviewError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a title for your blog post.');
      return;
    }

    if (!formData.content.trim()) {
      setError('Please write some content for your blog post.');
      return;
    }

    try {
      setLoading(true);
      const data = await api.post('/posts', formData);

      if (data.success && data.post) {
        navigate(`/posts/${data.post._id}`);
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError(err.message || 'Failed to publish post. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card">
        {/* Form Header */}
        <div className="form-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Cancel & Back</span>
          </Link>
          <div className="form-title-wrap">
            <div className="form-icon-wrap">
              <PenSquare size={22} />
            </div>
            <div>
              <h1 className="form-title">Create New Blog Post</h1>
              <p className="form-subtitle">Share your insights, stories, or technical discoveries with the community.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-banner error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="blog-editor-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Blog Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input form-input-lg"
              placeholder="e.g. Building Resilient Cloud Architectures in 2026"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              required
            />
            <span className="form-hint">{formData.title.length}/150 characters</span>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <div className="category-select-group">
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {POPULAR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="form-group">
            <label htmlFor="coverImage" className="form-label">
              Cover Image URL <span className="optional">(optional)</span>
            </label>
            <div className="input-with-icon">
              <Image size={18} className="input-prefix-icon" />
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                className="form-input with-icon"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.coverImage}
                onChange={handleChange}
              />
            </div>

            {/* Live Image Preview */}
            {formData.coverImage && !imagePreviewError && (
              <div className="image-preview-box">
                <span className="preview-label">Cover Preview:</span>
                <img
                  src={formData.coverImage}
                  alt="Preview"
                  className="preview-img"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}
            {imagePreviewError && (
              <span className="form-hint text-warning">
                Unable to load preview image from this URL.
              </span>
            )}
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">
              Short Description / Excerpt <span className="optional">(optional - auto-generated if left blank)</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              className="form-textarea"
              rows={2}
              placeholder="A brief 1-2 sentence overview shown on blog cards..."
              value={formData.excerpt}
              onChange={handleChange}
              maxLength={300}
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Blog Content <span className="required">*</span>
            </label>
            <p className="editor-tip">
              Tip: Use <code>### Subheading</code> for sections and blank lines between paragraphs.
            </p>
            <textarea
              id="content"
              name="content"
              className="form-textarea content-editor"
              rows={14}
              placeholder="Write your article here..."
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Publishing...' : 'Publish Blog Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
