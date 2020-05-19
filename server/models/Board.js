const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Board = new Schema({
  totalPosts: {type: Number, default: 0},
  boardId: String,
  description: String
});

module.exports = mongoose.model('board', Board);
