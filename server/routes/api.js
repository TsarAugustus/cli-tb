const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Board = require('../models/Board');
const Post = require('../models/Post');

router.get('/users/:id', function(req, res) {
  console.log('GET')
  return User
    .find({'username': new RegExp(req.params.id, 'i')})
    .then((users) => {
      return res.status(200).send(users);
    });
  console.log('GET');
});

router.post('/users', function(req, res) {
  console.log('POST');
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.save((err) => {
    if(err) console.log(err);
    return res.sendStatus(201);
  });
  console.log(req.body);
});

router.get('/boards', function(req, res) {
  return Board
    .find({})
    .then((boards) => {
      return res.status(200).send(boards);
    })
});

router.get('/boardList/:id', function(req, res) {
  console.log('GET BOARDS');
  return Board
    .find({'boardId': new RegExp(req.params.id, 'i')})
    .then((boards) => {
      return res.status(200).send(boards);
    })
});

router.get('/boardPosts/:id', function(req, res) {
  console.log(req.params.id)
  Post.find({postBoardId: req.params.id}).exec(function(err, posts) {
    if(err) console.log(err);
    console.log(posts)
    return res.status(200).send(posts);
  })
});

router.post('/boards', function(req, res) {
  console.log('POST BOARDS');
  let newBoard = new Board();
  newBoard.boardId = req.body.boardId;
  newBoard.description = req.body.description;
  newBoard.save((err) => {
    if(err) console.log(err);
    return res.sendStatus(201);
  });
});

router.post('/boards/:id', function(req, res) {
  Board.findOne({boardId: req.params.id}, function(err, board) {
    if(err) console.log(err);
    let newPost = new Post();
    newPost.postBoardId = req.params.id;
    newPost.content = req.body.content;
    newPost.threadNum = board.totalPosts;
    newPost.save((err) => {
      if(err) console.log(err);
      return res.sendStatus(201);
    })
  });
});

module.exports = router;
