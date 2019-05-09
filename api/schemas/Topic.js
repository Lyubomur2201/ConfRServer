const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  body: {
    type: String,
    required: true
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  questions: [{
    id: Number,
    question: {
      type: String,
      required: true
    },
    upvotes: [{
      type: String,
    }],
    author: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('Topic', TopicSchema);