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
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questions: [{
    id: mongoose.Schema.Types.Number,
    question: {
      type: String,
      required: true
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }]
});

module.exports = mongoose.model('Topic', TopicSchema);