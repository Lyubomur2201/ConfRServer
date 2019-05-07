const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Topic', TopicSchema);