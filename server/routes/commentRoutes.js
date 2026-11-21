const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { validateComment } = require('../middleware/validation');

router.post('/', validateComment, commentController.createComment);

module.exports = router;
