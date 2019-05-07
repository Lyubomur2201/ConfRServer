const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  question: {
    type: String,
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Question', QuestionSchema);