const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const {
  getCommentsByPost,
  createComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Post routes
router.get('/', getPosts);
router.get('/user/me', protect, getMyPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comments nested under posts
router.get('/:postId/comments', getCommentsByPost);
router.post('/:postId/comments', protect, createComment);

module.exports = router;
