// models/SavedItem.js
const { mongoose } = require('../config/database');

const SavedItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true,
    enum: ['twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'reddit', 'pinterest', 'web', 'other']
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  lastVisited: {
    type: Date
  },
  visitCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto update updatedAt field
SavedItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SavedItem', SavedItemSchema);