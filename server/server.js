const express = require('express');
const mongoose = require('mongoose');

const app = express();


mongoose.connect('mongodb://localhost:27017/cli', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB Connection');
});

const api = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', api);
app.use(function(req, res) {
  res.status(404).send('Doesn\'t exist');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
