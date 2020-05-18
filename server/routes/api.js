const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

module.exports = router;
