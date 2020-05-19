const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Board = require('../models/Board');
const inc = 1;

const Post = new Schema({
  postBoardId: String,
  threadNum: Number,
  content: String,
  replies: [{
    content: String
  }]
});

Post.pre("save", function(next){
  boardId = this._id;
  Board.findOneAndUpdate(
    {postBoardId: this.boardId},
    {$inc: {'totalPosts': inc}},
    {new:true},
    function(err, board) {
      if(err) console.log(err);
      //console.log(board);
      next();
    }
  );
});

module.exports = mongoose.model('post', Post);
