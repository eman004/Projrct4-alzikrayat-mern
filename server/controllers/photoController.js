const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const User = require('../models/User');

// GET /api/photos
const getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find()
      .populate('userId', 'firstName lastName email occupation location')
      .sort({ dateTime: -1 });

    res.status(200).json(photos);
  } catch (err) {
    next(err);
  }
};

// GET /api/photos/:id
const getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate(
      'userId',
      'firstName lastName email occupation location'
    );

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const comments = await Comment.find({ photoId: photo._id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: 1 });

    res.status(200).json({
      ...photo.toObject(),
      comments,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/photos
const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { title, description, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      fs.unlink(req.file.path, () => {});
      return res.status(401).json({ error: 'Authenticated user not found' });
    }

    const newPhoto = new Photo({
      userId,
      fileName: req.file.filename,
      title,
      description: description || '',
    });

    await newPhoto.save();

    const populatedPhoto = await Photo.findById(newPhoto._id).populate(
      'userId',
      'firstName lastName email occupation location'
    );

    res.status(201).json(populatedPhoto);
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(err);
  }
};

// DELETE /api/photos/:id
const remove = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to delete a photo' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own photos' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', photo.fileName);
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr && unlinkErr.code !== 'ENOENT') {
        console.error('Failed to delete image file:', unlinkErr);
      }
    });

    await Comment.deleteMany({ photoId: photo._id });
    await Photo.findByIdAndDelete(photo._id);

    res.status(200).json({ message: 'Photo deleted successfully', id: photo._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, remove };
