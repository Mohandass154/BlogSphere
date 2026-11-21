const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide blog content']
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    coverImage: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate excerpt if not provided
postSchema.pre('save', function () {
  if (!this.excerpt && this.content) {
    const stripped = this.content.replace(/<[^>]+>/g, '').trim();
    this.excerpt = stripped.length > 160 ? stripped.substring(0, 157) + '...' : stripped;
  }
});

module.exports = mongoose.model('Post', postSchema);
