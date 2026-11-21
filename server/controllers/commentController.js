const Comment = require('../models/Comment');
const Photo = require('../models/Photo');
const User = require('../models/User');

// POST /api/photos/:id/comments
const createComment = async (req, res, next) => {
  try {
    const photoId = req.params.id;
    const { comment, userId } = req.body;

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Authenticated user not found' });
    }

    const newComment = new Comment({
      photoId,
      userId,
      comment,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      'userId',
      'firstName lastName'
    );

    // Emit real-time comment event to all clients viewing this photo room 
    const io = req.app.get('io');
    if (io) {
      io.to(`photo_${photoId}`).emit('newComment', populatedComment);
    }

    res.status(201).json(populatedComment);
  } catch (err) {
    next(err);
  }
};

module.exports = { createComment };