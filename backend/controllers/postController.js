const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get all blog posts (with search & category filtering)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { excerpt: searchRegex },
        { category: searchRegex }
      ];
    }

    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category.trim();
    }

    const posts = await Post.find(query)
      .populate('author', 'name email bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posts
// @route   GET /api/posts/user/me
// @access  Private
const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, coverImage } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const post = await Post.create({
      title: title.trim(),
      content,
      excerpt: excerpt ? excerpt.trim() : undefined,
      category: category && category.trim() ? category.trim() : 'General',
      coverImage: coverImage ? coverImage.trim() : '',
      author: req.user._id
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email bio');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post (Only author)
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Verify user is author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own posts'
      });
    }

    const { title, content, excerpt, category, coverImage } = req.body;

    if (title) post.title = title.trim();
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt.trim();
    if (category) post.category = category.trim();
    if (coverImage !== undefined) post.coverImage = coverImage.trim();

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('author', 'name email bio');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post (Only author)
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Verify user is author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own posts'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    // Delete post
    await Post.findByIdAndDelete(post._id);

    res.status(200).json({
      success: true,
      message: 'Post and associated comments deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost
};
