import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const BlogCard = ({ post }) => {
  if (!post) return null;

  // Calculate estimated reading time
  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  // Format date
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const authorName = post.author?.name || 'Anonymous Author';
  const authorInitial = authorName.charAt(0).toUpperCase();

  // Excerpt fallback
  const excerpt = post.excerpt || (post.content ? post.content.slice(0, 140) + '...' : '');

  return (
    <article className="blog-card">
      <Link to={`/posts/${post._id}`} className="blog-card-media-link" tabIndex={-1}>
        <div className="blog-card-image-wrap">
          {post.coverImage ? (
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="blog-card-image" 
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="blog-card-image-placeholder" 
            style={{ display: post.coverImage ? 'none' : 'flex' }}
          >
            <span>{post.category || 'Blog'}</span>
          </div>
          <span className="card-category-badge">{post.category || 'General'}</span>
        </div>
      </Link>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="meta-item">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </span>
          <span className="meta-separator">•</span>
          <span className="meta-item">
            <Clock size={14} />
            <span>{readTime} min read</span>
          </span>
        </div>

        <h3 className="blog-card-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h3>

        <p className="blog-card-excerpt">{excerpt}</p>

        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-avatar">{authorInitial}</div>
            <div className="author-details">
              <span className="author-name">{authorName}</span>
            </div>
          </div>

          <Link to={`/posts/${post._id}`} className="read-more-link">
            <span>Read</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
