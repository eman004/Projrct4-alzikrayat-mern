const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Photo owner (userId) is required'],
  },
  fileName: {
    type: String,
    required: [true, 'Stored file name is required'],
  },
  title: {
    type: String,
    required: [true, 'Photo title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;
